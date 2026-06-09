(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var statusEl = document.getElementById('form-status');
  var submitBtn = form.querySelector('button[type="submit"]');
  var originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';

  function showStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = 'form-status ' + type;
  }

  function clearErrors() {
    form.querySelectorAll('.form-error').forEach(function (el) { el.remove(); });
    form.querySelectorAll('.error').forEach(function (el) { el.classList.remove('error'); });
  }

  function setFieldError(field, message) {
    field.classList.add('error');
    var error = document.createElement('div');
    error.className = 'form-error';
    error.textContent = message;
    field.parentNode.appendChild(error);
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    var digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    var firstName = form.querySelector('#first-name');
    var lastName = form.querySelector('#last-name');
    var phone = form.querySelector('#phone');
    var email = form.querySelector('#email');
    var message = form.querySelector('#message');

    var valid = true;

    if (!firstName.value.trim()) {
      setFieldError(firstName, 'First name is required.');
      valid = false;
    }
    if (!lastName.value.trim()) {
      setFieldError(lastName, 'Last name is required.');
      valid = false;
    }
    if (!phone.value.trim()) {
      setFieldError(phone, 'Phone number is required.');
      valid = false;
    } else if (!validatePhone(phone.value)) {
      setFieldError(phone, 'Please enter a valid phone number.');
      valid = false;
    }
    if (!email.value.trim()) {
      setFieldError(email, 'Email is required.');
      valid = false;
    } else if (!validateEmail(email.value)) {
      setFieldError(email, 'Please enter a valid email address.');
      valid = false;
    }
    if (!valid) {
      showStatus('Please correct the errors above.', 'error');
      return;
    }

    var payload = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      phone: phone.value.trim(),
      email: email.value.trim(),
      message: message ? message.value.trim() : ''
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }
    showStatus('', '');

    fetch('/api/contact', {
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
        showStatus('Thank you! Your request has been submitted. We\'ll be in touch within one business day.', 'success');
        form.reset();
      })
      .catch(function (err) {
        showStatus(err.message || 'Something went wrong. Please call us at (919) 441-0934.', 'error');
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      });
  });
})();
