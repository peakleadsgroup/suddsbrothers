(function () {
  'use strict';

  var TOTAL_STEPS = 3;
  var currentStep = 1;
  var hasTrackedEngagement = false;
  var isSubmitting = false;

  var formData = {
    authorizedDecisionMaker: null,
    address: null
  };

    var progressFill = document.getElementById('progressFill');
    var progressBar = document.getElementById('progressBar');
    var landerHeading = document.getElementById('landerHeading');
    var unauthorizedNotice = document.getElementById('unauthorizedNotice');
  var submitStatus = document.getElementById('submitStatus');

  function trackPixel(eventName, params) {
    if (typeof fbq !== 'function') return;
    fbq('track', eventName, params || {});
  }

  function trackEngagement() {
    if (hasTrackedEngagement) return;
    hasTrackedEngagement = true;
    trackPixel('ViewContent', {
      content_name: 'pressure_washing_quiz_start',
      content_category: 'home_services'
    });
  }

  function updateProgress() {
    if (!progressFill) return;
    progressFill.style.width = ((currentStep / TOTAL_STEPS) * 100) + '%';
  }

  function showStep(stepId) {
    document.querySelectorAll('.lander-step').forEach(function (el) {
      el.classList.remove('active');
    });

    var target = typeof stepId === 'number'
      ? document.getElementById('step' + stepId)
      : document.getElementById(stepId);

    if (target) target.classList.add('active');

    if (typeof stepId === 'number') {
      currentStep = stepId;
      updateProgress();
    }
  }

  function selectDecisionMaker(element, value) {
    var options = element.parentElement.querySelectorAll('.lander-option');
    options.forEach(function (opt) {
      opt.classList.remove('selected');
    });
    element.classList.add('selected');
    formData.authorizedDecisionMaker = value;
    trackEngagement();

    if (value === 'no') {
      if (unauthorizedNotice) unauthorizedNotice.classList.add('visible');
      return;
    }

    if (unauthorizedNotice) unauthorizedNotice.classList.remove('visible');
    setTimeout(function () {
      showStep(2);
    }, 200);
  }

  window.selectDecisionMaker = selectDecisionMaker;

  function validateAddressForm() {
    var streetInput = document.getElementById('street');
    var cityInput = document.getElementById('city');
    var stateInput = document.getElementById('state');
    var zipInput = document.getElementById('zip');
    var cityField = document.getElementById('cityField');
    var stateZipRow = document.getElementById('stateZipRow');
    var streetError = document.getElementById('streetError');
    var addressNextBtn = document.getElementById('addressNextBtn');

    if (!streetInput) return;

    var street = streetInput.value.trim();
    var city = cityInput ? cityInput.value.trim() : '';
    var state = stateInput ? stateInput.value.trim() : '';
    var zip = zipInput ? zipInput.value.trim() : '';
    var startsWithNumber = /^\d/.test(street);

    if (street.length > 0) {
      if (!startsWithNumber) {
        streetInput.classList.add('error');
        if (streetError) streetError.classList.add('visible');
      } else {
        streetInput.classList.remove('error');
        if (streetError) streetError.classList.remove('visible');
      }
      if (cityField) cityField.classList.remove('lander-hidden');
      if (stateZipRow) stateZipRow.classList.remove('lander-hidden');
    } else {
      streetInput.classList.remove('error');
      if (streetError) streetError.classList.remove('visible');
      if (cityField) cityField.classList.add('lander-hidden');
      if (stateZipRow) stateZipRow.classList.add('lander-hidden');
      if (cityInput) cityInput.value = '';
      if (stateInput) stateInput.value = '';
      if (zipInput) zipInput.value = '';
    }

    var valid = street && city && state && zip.length === 5 && startsWithNumber;
    if (addressNextBtn) addressNextBtn.disabled = !valid;

    if (valid) {
      formData.address = { street: street, city: city, state: state, zip: zip };
    } else if (formData.address) {
      delete formData.address;
    }
  }

  window.validateAddressForm = validateAddressForm;

  function goToContactStep() {
    validateAddressForm();
    if (!formData.address) return;
    showStep(3);
  }

  window.goToContactStep = goToContactStep;

  function validateContactForm() {
    var firstNameInput = document.getElementById('contactFirstName');
    var lastNameInput = document.getElementById('contactLastName');
    var emailInput = document.getElementById('contactEmail');
    var emailField = document.getElementById('contactEmailField');
    var phoneInput = document.getElementById('contactPhone');
    var submitBtn = document.getElementById('contactSubmitBtn');

    var firstName = firstNameInput ? firstNameInput.value.trim() : '';
    var lastName = lastNameInput ? lastNameInput.value.trim() : '';
    var email = emailInput ? emailInput.value.trim() : '';
    var phone = phoneInput ? phoneInput.value.trim() : '';
    var digits = phone.replace(/\D/g, '');

    if (emailField) {
      if (phone.length > 0) {
        emailField.classList.remove('lander-hidden');
      } else {
        emailField.classList.add('lander-hidden');
        if (emailInput) emailInput.value = '';
        email = '';
      }
    }

    var emailValid = phone.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    var valid = firstName.length > 0 &&
      lastName.length > 0 &&
      digits.length >= 10 &&
      emailValid &&
      (phone.length === 0 || email.length > 0);

    if (submitBtn && !isSubmitting) submitBtn.disabled = !valid;
    return valid;
  }

  window.validateContactForm = validateContactForm;

  function attachPlacesAutocomplete() {
    if (!window.google || !google.maps || !google.maps.places) return;

    var addressInput = document.getElementById('street');
    if (!addressInput) return;

    var autocomplete = new google.maps.places.Autocomplete(addressInput, {
      types: ['address'],
      componentRestrictions: { country: ['us'] },
      fields: ['address_components', 'formatted_address', 'geometry']
    });

    autocomplete.addListener('place_changed', function () {
      var place = autocomplete.getPlace();
      if (!place || !place.address_components) return;

      var comps = {};
      place.address_components.forEach(function (c) {
        c.types.forEach(function (t) {
          comps[t] = c;
        });
      });

      var streetAddress = '';
      if (comps.street_number) streetAddress += comps.street_number.long_name + ' ';
      if (comps.route) streetAddress += comps.route.long_name;
      if (streetAddress.trim()) addressInput.value = streetAddress.trim();

      var cityField = document.getElementById('cityField');
      var stateZipRow = document.getElementById('stateZipRow');
      if (streetAddress.trim()) {
        if (cityField) cityField.classList.remove('lander-hidden');
        if (stateZipRow) stateZipRow.classList.remove('lander-hidden');
      }

      var cityInput = document.getElementById('city');
      var stateInput = document.getElementById('state');
      var zipInput = document.getElementById('zip');

      if (comps.locality && cityInput) cityInput.value = comps.locality.long_name;
      else if (comps.sublocality && cityInput) cityInput.value = comps.sublocality.long_name;
      if (comps.administrative_area_level_1 && stateInput) {
        stateInput.value = comps.administrative_area_level_1.short_name;
      }
      if (comps.postal_code && zipInput) zipInput.value = comps.postal_code.long_name;

      validateAddressForm();
    });
  }

  function showSubmitError(message) {
    if (!submitStatus) return;
    submitStatus.textContent = message;
    submitStatus.className = 'lander-status error';
  }

  function clearSubmitError() {
    if (!submitStatus) return;
    submitStatus.textContent = '';
    submitStatus.className = 'lander-status';
  }

  function submitLanderForm() {
    if (isSubmitting) return;
    if (!validateContactForm()) return;
    if (!formData.address || formData.authorizedDecisionMaker !== 'yes') return;

    clearSubmitError();
    isSubmitting = true;

    var submitBtn = document.getElementById('contactSubmitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }

    var payload = {
      firstName: document.getElementById('contactFirstName').value.trim(),
      lastName: document.getElementById('contactLastName').value.trim(),
      email: document.getElementById('contactEmail').value.trim(),
      phone: document.getElementById('contactPhone').value.trim(),
      street: formData.address.street,
      city: formData.address.city,
      state: formData.address.state,
      zip: formData.address.zip,
      authorizedDecisionMaker: formData.authorizedDecisionMaker
    };

    fetch('/api/lander', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error(data.error || 'Submission failed.');
          return data;
        });
      })
      .then(function () {
        trackPixel('Lead', {
          content_name: 'pressure_washing_lander_quote',
          content_category: 'home_services'
        });
        if (progressBar) progressBar.style.display = 'none';
        if (landerHeading) landerHeading.style.display = 'none';
        showStep('success');
      })
      .catch(function (err) {
        showSubmitError(err.message || 'Something went wrong. Please call (919) 441-0934.');
      })
      .finally(function () {
        isSubmitting = false;
        if (submitBtn) {
          submitBtn.textContent = 'Get My Free Quote';
          validateContactForm();
        }
      });
  }

  window.submitLanderForm = submitLanderForm;
  window.__attachPlaces = attachPlacesAutocomplete;

  ['contactFirstName', 'contactLastName', 'contactEmail', 'contactPhone'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', validateContactForm);
  });

  updateProgress();
})();
