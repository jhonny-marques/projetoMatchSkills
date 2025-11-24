// js/main.js

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Controle do Modal ---
    const openModalButtons = document.querySelectorAll("[data-modal-target]");
    const closeModalButtons = document.querySelectorAll("[data-modal-close]");
    const backdrop = document.getElementById("modalBackdrop");

    openModalButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const modal = document.querySelector(button.dataset.modalTarget);
            openModal(modal);
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const modal = button.closest(".modal");
            closeModal(modal);
        });
    });

    if (backdrop) {
        backdrop.addEventListener("click", () => {
            const openModal = document.querySelector(".modal.show");
            if (openModal) {
                closeModal(openModal);
            }
        });
    }

    function openModal(modal) {
        if (modal == null) return;
        if (backdrop) backdrop.classList.add("show");
        modal.classList.add("show");
    }

    function closeModal(modal) {
        if (modal == null) return;
        if (backdrop) backdrop.classList.remove("show");
        modal.classList.remove("show");
    }

    // --- Controle do Multi-Select de Habilidades ---
    const multiSelectContainers = document.querySelectorAll(".multi-select-container");
    let allSkills = []; // Cache for all skills from the database

    // Fetch all skills once and store them
    async function fetchAllSkills() {
        if (allSkills.length > 0) return; // Avoid re-fetching
        try {
            const response = await fetch('/api/habilidades');
            if (response.ok) {
                const data = await response.json();
                allSkills = data.data || [];
            } else {
                console.error('Falha ao buscar habilidades');
            }
        } catch (error) {
            console.error('Erro ao buscar habilidades:', error);
        }
    }

    // Fetch skills on page load if a multi-select exists
    if (multiSelectContainers.length > 0) {
        fetchAllSkills();
    }

    multiSelectContainers.forEach(container => {
        const input = container.querySelector(".multi-select-input");
        const suggestions = container.querySelector(".suggestions-dropdown");
        const selectedSkills = container.querySelector(".selected-skills");

        input.addEventListener("focus", () => {
            showSuggestions(input.value);
        });

        input.addEventListener("input", () => {
            showSuggestions(input.value);
        });

        document.addEventListener("click", (e) => {
            if (!container.contains(e.target)) {
                suggestions.style.display = "none";
            }
        });

        function showSuggestions(filter) {
            suggestions.innerHTML = "";

            // Get IDs of skills selected in the CURRENT container
            const ownSelectedSkillIds = new Set(
                Array.from(selectedSkills.children).map(pill => pill.getAttribute('data-skill-id'))
            );

            // Get IDs of skills selected in OTHER containers on the same page
            const otherSelectedSkillIds = new Set();
            multiSelectContainers.forEach(otherContainer => {
                if (otherContainer !== container) {
                    const otherSelected = otherContainer.querySelector('.selected-skills');
                    Array.from(otherSelected.children).forEach(pill => {
                        otherSelectedSkillIds.add(pill.getAttribute('data-skill-id'));
                    });
                }
            });

            const filteredSkills = allSkills.filter(skill => {
                const isSelected = ownSelectedSkillIds.has(String(skill.id_habilidade)) || otherSelectedSkillIds.has(String(skill.id_habilidade));
                const nameMatches = skill.nome.toLowerCase().includes(filter.toLowerCase());
                return !isSelected && nameMatches;
            });

            filteredSkills.forEach(skill => {
                const item = document.createElement("div");
                item.classList.add("suggestion-item");
                item.textContent = skill.nome;
                item.addEventListener("click", () => {
                    addSkill(skill.nome, skill.id_habilidade);
                    input.value = "";
                    suggestions.style.display = "none";
                });
                suggestions.appendChild(item);
            });
            suggestions.style.display = filteredSkills.length > 0 ? "block" : "none";
        }

        function addSkill(skillName, skillId) {
            const existing = Array.from(selectedSkills.children).find(pill => pill.getAttribute('data-skill-id') === String(skillId));
            if (existing) return;

            const pill = document.createElement("div");
            pill.classList.add("skill-pill");
            pill.setAttribute('data-skill-id', skillId);
            pill.setAttribute('data-skill-name', skillName);
            pill.innerHTML = `
                ${skillName}
                <span class="remove-skill" title="Remover">&times;</span>
            `;
            
            pill.querySelector(".remove-skill").addEventListener("click", () => {
                pill.remove();
                showSuggestions(input.value); // Refresh suggestions to show the removed skill
            });
            selectedSkills.appendChild(pill);

            // On buscar-vagas.html, uncheck "use profile" if a skill is manually added
            const useProfileCheckbox = document.getElementById('useProfile');
            if (useProfileCheckbox) {
                useProfileCheckbox.checked = false;
            }
        }

        // Make addSkill available to other scripts
        container.addSkill = addSkill;
    });

    // --- Function to populate skills on page load (e.g., on profile page) ---
    // This function can be called from other scripts.
    window.populateSelectedSkills = (container, skills, isEditMode = false) => {
        const selectedSkillsContainer = container.querySelector('.selected-skills');
        if (!selectedSkillsContainer) return;

        selectedSkillsContainer.innerHTML = ''; // Clear existing skills
        skills.forEach(skill => {
            const pill = document.createElement("div");
            pill.classList.add("skill-pill");
            // Assumes skill object has 'id_habilidade' and 'nome' properties
            pill.setAttribute('data-skill-id', skill.id_habilidade);
            pill.setAttribute('data-skill-name', skill.nome);
            
            const removeSpanDisplay = isEditMode ? 'inline' : 'none';
            pill.innerHTML = `${skill.nome} <span class="remove-skill" title="Remover" style="display: ${removeSpanDisplay};">&times;</span>`;
            selectedSkillsContainer.appendChild(pill);
        });
    };

    // --- Formatação de CPF e CNPJ ---
    const cpfInput = document.getElementById("cpf");
    const cnpjInput = document.getElementById("cnpj");

    if (cpfInput) {
        cpfInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "");
            if (value.length > 11) {
                value = value.slice(0, 11);
            }

            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            e.target.value = value;
        });
    }

    if (cnpjInput) {
        cnpjInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "");
            if (value.length > 14) {
                value = value.slice(0, 14);
            }
            
            value = value.replace(/(\d{2})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d)/, "$1/$2");
            value = value.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
            e.target.value = value;
        });
    }

     // --- Controle de Notificações ---
    const notificationContainer = document.getElementById('notification-container');

    window.showNotification = (message, type = 'success') => {
        if (!notificationContainer) return;

        // Cria o elemento da notificação
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.innerHTML = `
            <p>${message}</p>
            <button class="notification-close">&times;</button>
        `;

        // Adiciona ao container
        notificationContainer.appendChild(notification);

        // Função para remover a notificação
        const removeNotification = () => {
            notification.classList.add('fade-out');
            // Espera a animação de fade-out terminar para remover o elemento
            notification.addEventListener('animationend', () => {
                notification.remove();
            });
        };

        // Remove após 5 segundos
        const timer = setTimeout(removeNotification, 5000);

        // Adiciona evento de clique no botão de fechar
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(timer); // Cancela o timer se fechar manualmente
            removeNotification();
        });
    }

    // --- Controle do Diálogo de Confirmação ---
    const confirmationDialog = document.getElementById('confirmationDialog');
    const confirmationBackdrop = document.getElementById('confirmationBackdrop');

    window.showConfirmationDialog = (message) => {
        // Retorna uma Promise que resolve para true (confirmar) ou false (cancelar)
        return new Promise((resolve) => {
            if (!confirmationDialog || !confirmationBackdrop) {
                resolve(false); // Se os elementos não existirem, cancela a ação.
                return;
            }

            // Elementos do diálogo
            const messageElement = confirmationDialog.querySelector('.confirmation-message');
            const confirmBtn = confirmationDialog.querySelector('.btn-confirm');
            const cancelBtn = confirmationDialog.querySelector('.btn-cancel');

            // Define a mensagem
            messageElement.textContent = message;

            // Mostra o diálogo e o backdrop
            confirmationBackdrop.classList.add('show');
            confirmationDialog.classList.add('show');

            // Função para fechar e resolver a promise
            const close = (result) => {
                confirmationBackdrop.classList.remove('show');
                confirmationDialog.classList.remove('show');
                resolve(result);
            };

            // Adiciona listeners que só rodam uma vez
            confirmBtn.addEventListener('click', () => close(true), { once: true });
            cancelBtn.addEventListener('click', () => close(false), { once: true });
            confirmationBackdrop.addEventListener('click', () => close(false), { once: true });
        });
    }
});