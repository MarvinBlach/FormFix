document.addEventListener("DOMContentLoaded", function() {
    const swiperInstance = document.querySelector('#form-swiper').swiper;

     // Email validation function
     function isValidEmail(email) {
        const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // Simple email pattern
        return pattern.test(email);

        
    }
    function isValidZipCode(zipCode) {
        const pattern = /^\d{5}$/; // German zip code pattern
        return pattern.test(zipCode);
    }   

    function adjustContentForUserType() {
        var urlParams = new URLSearchParams(window.location.search);
        var userType = urlParams.get('userType') || localStorage.getItem("userType") || "b2c";

        // Conditionally adjust the select field for 'b2b' users
        const userTypeSelectField = document.querySelector('#Art-Des-Auftraggebers-6');
        if (userType === "b2b") {
            // Remove options and set default for 'b2b'
            Array.from(userTypeSelectField.options).forEach(option => {
                if (option.value === "privat") {
                    option.remove(); // Remove 'Privatperson' option
                } else if (option.value === "weg") {
                    option.selected = true; // Set 'WEG' as the default option
                }
            });

            // Remove elements with 'only-b2c' attribute
            const onlyB2CElements = document.querySelectorAll('[remove]');
            onlyB2CElements.forEach(element => {
                element.remove();
            });
        }
        // No adjustments needed for 'b2c' as the original setup suits them
    }

    // Call the function to adjust content based on the userType
    adjustContentForUserType();

    function toggleNextButtonOnLastSlide() {
        const nextButton = document.querySelector('[next]');
        // Check if the active slide is the last slide
        if (swiperInstance.isEnd) {
            nextButton.style.display = 'none'; // Hide the 'Next' button
        } else {
            nextButton.style.display = ''; // Show the 'Next' button if it's not the last slide
        }
    }

    function checkRequiredFieldsInActiveSlide() {
        const activeSlide = document.querySelector('#form-swiper .is-active');
        const requiredElements = activeSlide.querySelectorAll('[pflicht]');
        const nextButton = document.querySelector('[next]');

        let allFieldsFilled = true;

        // Check radio buttons and group them by name
        const radioGroups = {};
        requiredElements.forEach(element => {
            if (element.type.toLowerCase() === 'radio') {
                const name = element.name;
                radioGroups[name] = radioGroups[name] || [];
                radioGroups[name].push(element);
            }
        });

        // Ensure at least one radio button in each group is checked
        Object.values(radioGroups).forEach(group => {
            if (!group.some(radio => radio.checked)) {
                allFieldsFilled = false;
            }
        });

        // Validate other inputs, including text and select fields
        requiredElements.forEach(element => {
            if (element.tagName.toLowerCase() === 'select' && element.value === 'Auswahl') { // Assuming 'Auswahl' is your placeholder value
                allFieldsFilled = false;
            } else if (element.tagName.toLowerCase() !== 'select' && element.value.trim() === '') {
                allFieldsFilled = false;
            }
        });

        requiredElements.forEach(element => {
            if (element.type.toLowerCase() === 'email' && !isValidEmail(element.value)) {
                allFieldsFilled = false; // Mark as invalid if the email is not correctly formatted
            }
        });

        requiredElements.forEach(element => {
            if (element.type.toLowerCase() === 'email' && !isValidEmail(element.value)) {
                allFieldsFilled = false; // Mark as invalid if the email is not correctly formatted
            } else if (element.getAttribute('zip') !== null && !isValidZipCode(element.value)) {
                allFieldsFilled = false; // Mark as invalid if the zip code is not correctly formatted
            }
        });



        

        // Apply or remove 'is-off' based on field validation
        if (allFieldsFilled) {
            nextButton.classList.remove('is-off');
            nextButton.removeAttribute('aria-disabled');
        } else {
            nextButton.classList.add('is-off');
            nextButton.setAttribute('aria-disabled', 'true');
        }
    }

    function skipSlideIfNeeded() {
        const rechnungsadresseSelect = document.querySelector('#Rechnungsadresse-3');
        if(rechnungsadresseSelect && rechnungsadresseSelect.value === 'gleiche-adresse') {
            const canSkipElements = document.querySelectorAll('[can-skip]');
            canSkipElements.forEach(element => {
                element.removeAttribute('pflicht');
            });
            // Force check after modification to ensure the next button is clickable.
            checkRequiredFieldsInActiveSlide();
            // Automatically click the next button to skip
            const nextButton = document.querySelector('[next]:not(.is-off)');
            if(nextButton) {
                nextButton.click();
            }
        }
    }

    // Re-validate fields when the slide changes and possibly skip slide
    swiperInstance.on('slideChange', function () {
        checkRequiredFieldsInActiveSlide();
        skipSlideIfNeeded(); // Call skip function on slide change if conditions are met
        toggleNextButtonOnLastSlide();
    });

    // Attach event listeners for real-time field validation
    document.querySelectorAll('#form-swiper [pflicht]').forEach(input => {
        input.addEventListener('change', checkRequiredFieldsInActiveSlide);
        // Include 'keyup' event listener for text inputs for real-time feedback
        if (input.tagName.toLowerCase() !== 'select') {
            input.addEventListener('keyup', checkRequiredFieldsInActiveSlide);
        }
    });

    // Listener for 'Rechnungsadresse-3' select field change
    const rechnungsadresseSelect = document.querySelector('#Rechnungsadresse-3');
    if(rechnungsadresseSelect) {
        rechnungsadresseSelect.addEventListener('change', function() {
            if(this.value === 'gleiche-adresse') {
                const nextButton = document.querySelector('[next]');
                nextButton.addEventListener('click', skipSlideIfNeeded, {once: true});
            }
        });
    }

    // Perform an initial validation check
    checkRequiredFieldsInActiveSlide();
});
