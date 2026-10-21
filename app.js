document.addEventListener("DOMContentLoaded", () => {
    
    const ctaBtn = document.getElementById("cta-scroll");
    const overviewSection = document.getElementById("overview");

    if (ctaBtn && overviewSection) {
        ctaBtn.addEventListener("click", () => {
            overviewSection.scrollIntoView({ behavior: "smooth" });
        });
    }

    const closeAlertBtn = document.getElementById("close-alert-btn");
    const credentialBar = document.getElementById("credential-bar");

    if (closeAlertBtn && credentialBar) {
        closeAlertBtn.addEventListener("click", () => {
            credentialBar.style.transition = "opacity 0.3s ease";
            credentialBar.style.opacity = "0";
            setTimeout(() => {
                credentialBar.remove();
            }, 300);
        });
    }

    const flashcardPanel = document.getElementById("flashcard-panel");
    const flashcardContent = document.getElementById("flashcard-content");
    const nextFlashcardBtn = document.getElementById("next-flashcard");

    const flashcards = [];
    const accordionItems = document.querySelectorAll(".accordion-item");

    accordionItems.forEach(item => {
        const headerBtn = item.querySelector(".accordion-button");
        const bodyContent = item.querySelector(".accordion-body");
        
        if (headerBtn && bodyContent) {
            const questionText = headerBtn.textContent.replace(/\s+/g, ' ').trim();
            const answerText = bodyContent.textContent.replace(/\s+/g, ' ').trim();
            
            flashcards.push({
                q: questionText,
                a: answerText
            });
        }
    });

    if (flashcards.length === 0) {
        flashcards.push({ q: "What does BLET stand for?", a: "Basic Law Enforcement Training" });
    }

    let currentCardIndex = -1;
    let showingAnswer = false;

    function renderFlashcard() {
        if (currentCardIndex === -1) {
            flashcardContent.innerHTML = `
                <h4 class="fw-bold text-gold">Click to Reveal Question</h4>
                <p class="mb-0">Test your constitutional vocabulary parameters.</p>
            `;
            showingAnswer = false;
            return;
        }

        const currentCard = flashcards[currentCardIndex];
        if (!showingAnswer) {
            flashcardContent.innerHTML = `
                <span class="badge bg-gold text-dark mb-2">Question Portfolio</span>
                <h4 class="fw-bold text-white mb-0" style="font-size: 1.15rem;">${currentCard.q}</h4>
                <small class="text-muted d-block mt-3">(Click card to view operational breakdown)</small>
            `;
        } else {
            flashcardContent.innerHTML = `
                <span class="badge bg-success text-white mb-2">Operational Breakdown</span>
                <h4 class="fw-bold text-gold mb-0" style="font-size: 1rem; font-weight: normal;">${currentCard.a}</h4>
                <small class="text-muted d-block mt-3">(Click card to toggle back to question)</small>
            `;
        }
    }

    if (flashcardPanel) {
        flashcardPanel.addEventListener("click", () => {
            if (currentCardIndex === -1) {
                currentCardIndex = 0;
                showingAnswer = false;
            } else {
                showingAnswer = !showingAnswer;
            }
            renderFlashcard();
        });
    }

    if (nextFlashcardBtn) {
        nextFlashcardBtn.addEventListener("click", (e) => {
            e.stopPropagation(); 
            currentCardIndex = (currentCardIndex + 1) % flashcards.length;
            showingAnswer = false;
            renderFlashcard();
        });
    }


    const gameGrid = document.getElementById("game-grid");
    const gameFeedback = document.getElementById("game-feedback");
    
    let targetSector = Math.floor(Math.random() * 3) + 1;
    let simulationActive = true;
    
    let timeRemaining = 15;
    let timerInterval = null;

    let timerDisplay = document.createElement("div");
    timerDisplay.className = "mb-2 text-center fw-bold text-white";
    timerDisplay.style.fontSize = "1.1rem";
    timerDisplay.innerHTML = `⏱️ Time Left: <span class="text-gold">${timeRemaining}s</span>`;
    
    if (gameFeedback && gameGrid) {
        gameFeedback.parentNode.insertBefore(timerDisplay, gameFeedback);
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timeRemaining--;
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                timerDisplay.innerHTML = `⏱️ Time Left: <span class="text-danger">0s</span>`;
                endGame(false, "Timeout");
            } else {
                timerDisplay.innerHTML = `⏱️ Time Left: <span class="text-gold">${timeRemaining}s</span>`;
            }
        }, 1000);
    }

    function endGame(isWin, reason) {
        simulationActive = false;
        clearInterval(timerInterval);
        
        const gameCards = gameGrid.querySelectorAll(".game-card");
        
        if (isWin) {
            gameFeedback.className = "mt-3 text-center fw-bold text-success";
            gameFeedback.innerHTML = `🎯 Evidence Secured! Clear chain of custody established before contamination window closed.`;
        } else {
            gameCards.forEach(c => {
                if (!c.classList.contains("bg-success")) {
                    c.classList.remove("bg-light");
                    c.classList.add("bg-danger", "text-white");
                }
            });
            
            gameFeedback.className = "mt-3 text-center fw-bold text-danger";
            if (reason === "Timeout") {
                gameFeedback.innerHTML = `🚨 Contamination Complete! The countdown reached zero. Crime scene is compromised.`;
            } else {
                gameFeedback.innerHTML = `🚨 Contamination Complete! No viable samples remaining. Simulation over.`;
            }
        }
    }

    if (gameGrid && gameFeedback) {
        const gameCards = gameGrid.querySelectorAll(".game-card");

        startTimer();

        gameCards.forEach(card => {
            card.addEventListener("click", () => {
                if (!simulationActive) return; 

                const selectedSector = parseInt(card.getAttribute("data-index"), 10);
                const sectorLabel = card.textContent.trim();

                gameCards.forEach(c => {
                    c.classList.remove("bg-success", "bg-warning", "text-white");
                    c.classList.add("bg-light");
                });

                if (selectedSector === targetSector) {
                    card.classList.remove("bg-light");
                    card.classList.add("bg-success", "text-white");
                    endGame(true, "Found");
                } else {
                    card.classList.remove("bg-light");
                    card.classList.add("bg-warning", "text-dark");
                    
                    gameFeedback.className = "mt-3 text-center fw-bold text-warning";
                    gameFeedback.innerHTML = `⚠️ Empty search vector! No objects secured in ${sectorLabel}. Quick, try another room!`;
                }
            });
        });
    }
});
