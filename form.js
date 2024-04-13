document.addEventListener("DOMContentLoaded", function() {
    const swiperInstance = document.querySelector('#form-swiper').swiper;
    handleInputValidation();

     // Email validation function
     function isValidEmail(email) {
        const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // Simple email pattern
        return pattern.test(email);

        
    }
    function isValidZipCode(zipCode) {
        const pattern = /^\d{5}$/; // German zip code pattern
        return pattern.test(zipCode);
    }
    
    function handleInputValidation() {
        console.log('Handling input validation');

        // Get the email and zip code input fields
        const emailInput = document.querySelector('input[type="email"]');
        const zipCodeInputs = document.querySelectorAll('[zip]');

        // Get the error message element
        const errorElement = document.querySelector('[error]');

        // Add input event listener to email input
        emailInput.addEventListener('input', () => {
            console.log('Email input changed');
            if (!isValidEmail(emailInput.value)) {
                console.log('Invalid email');
                errorElement.textContent = 'Inkorrekte Email-Adresse';
                errorElement.classList.remove('no-vis');
            } else {
                console.log('Valid email');
                errorElement.classList.add('no-vis');
            }
        });

        // Add input event listeners to all zip code inputs
        zipCodeInputs.forEach(zipCodeInput => {
            zipCodeInput.addEventListener('input', () => {
                console.log('Zip code input changed');
                if (!isValidZipCode(zipCodeInput.value)) {
                    console.log('Invalid zip code');
                    errorElement.textContent = 'Inkorrekte Postleitzahl';
                    errorElement.classList.remove('no-vis');
                } else {
                    console.log('Valid zip code');
                    errorElement.classList.add('no-vis');
                }
            });
        });
    }

    function adjustContentForUserType() {
        console.log('Running adjustContentForUserType');
    
        // Get both option-1 and option-2 input elements
        const option1Select = document.querySelector('input[pflicht="option-1"]');
        const option2Select = document.querySelector('input[pflicht="option-2"]');
    
        // Function to handle the logic based on the current selected option
        const handleSelectionChange = () => {
            // Delay checking the condition by 100ms
            setTimeout(() => {
                console.log('Checking selected option');
    
                // Check if option-2 is selected and its previous sibling has 'w--redirected-checked' class
                if (option2Select.previousElementSibling.classList.contains('w--redirected-checked')) {
                    console.log('option-2 is selected and previous element is redirected-checked');
    
                    // Perform actions when option-2 is selected
                    document.querySelectorAll('[remove]').forEach(element => {
                        element.classList.add('hide');
                        console.log('Added hide class to element:', element);
                    });
    
                    document.querySelectorAll('[auftraggeber]').forEach(element => {
                        element.removeAttribute('pflicht');
                        console.log('Removed pflicht attribute from element:', element);
                    });
                } else {
                    console.log('option-1 is selected or option-2 checkbox is not redirected-checked');
    
                    // Perform reverse actions if option-1 is selected or option-2 checkbox is not redirected-checked
                    document.querySelectorAll('[remove]').forEach(element => {
                        element.classList.remove('hide');
                        console.log('Removed hide class from element:', element);
                    });
    
                    document.querySelectorAll('[auftraggeber]').forEach(element => {
                        element.setAttribute('pflicht', 'option-1');
                        console.log('Added pflicht attribute to element:', element);
                    });
                }
            }, 100); // Delay set to 100 milliseconds
        };
    
        // Add click event listeners to both option-1 and option-2 elements
        option1Select.addEventListener('click', handleSelectionChange);
        option2Select.addEventListener('click', handleSelectionChange);
    }
    
    // Call the function to set up the event listeners when the script loads
    console.log('Calling adjustContentForUserType');
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

    let hasOption2BeenProcessed = false;

    
function skipSlideIfNeededModified() {
    if (hasOption2BeenProcessed) return;

    const optionSelect = document.querySelector('input[pflicht="option-2"]');
    if (optionSelect && optionSelect.previousElementSibling.classList.contains('w--redirected-checked')) {
        document.querySelectorAll('[can-skip]').forEach(element => {
            element.removeAttribute('pflicht');
        });
        checkRequiredFieldsInActiveSlide();

        const nextButton = document.querySelector('[next]:not(.is-off)');
        if (nextButton) nextButton.click();

        // Hide the element with the attribute rechnungsadresse-select and set the value of Rechnungsadresse-3 to 'gleiche-adresse'
        const rechnungsadresseElement = document.querySelector('[rechnungsadresse-select]');
        const rechnungsadresseSelect = document.querySelector('#Rechnungsadresse-3');
        if (rechnungsadresseElement) {
            rechnungsadresseElement.style.display = 'none';
        }
        if (rechnungsadresseSelect) {
            rechnungsadresseSelect.value = 'gleiche-adresse';
        }

        hasOption2BeenProcessed = true;
    }
}


    
    

    // Re-validate fields when the slide changes and possibly skip slide
    swiperInstance.on('slideChange', function () {
        checkRequiredFieldsInActiveSlide();
        skipSlideIfNeededModified();
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
