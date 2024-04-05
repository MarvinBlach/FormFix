document.addEventListener("DOMContentLoaded", function() {
    const swiperInstance = document.querySelector('#form-swiper').swiper;

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

        // Apply or remove 'is-off' based on field validation
        if (allFieldsFilled) {
            nextButton.classList.remove('is-off');
            nextButton.removeAttribute('aria-disabled');
        } else {
            nextButton.classList.add('is-off');
            nextButton.setAttribute('aria-disabled', 'true');
        }
    }

    // Re-validate fields when the slide changes
    swiperInstance.on('slideChange', function () {
        checkRequiredFieldsInActiveSlide();
    });

    // Attach event listeners for real-time field validation
    document.querySelectorAll('#form-swiper [pflicht]').forEach(input => {
        input.addEventListener('change', checkRequiredFieldsInActiveSlide);
        // Include 'keyup' event listener for text inputs for real-time feedback
        if (input.tagName.toLowerCase() !== 'select') {
            input.addEventListener('keyup', checkRequiredFieldsInActiveSlide);
        }
    });

    // Perform an initial validation check
    checkRequiredFieldsInActiveSlide();
});
