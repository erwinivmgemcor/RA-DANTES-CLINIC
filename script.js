document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if(mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
      const icon = mobileMenuBtn.querySelector('i');
      if (mobileMenu.classList.contains('hidden')) {
        icon.classList.replace('fa-xmark', 'fa-bars');
      } else {
        icon.classList.replace('fa-bars', 'fa-xmark');
      }
    });
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      const icon = mobileMenuBtn.querySelector('i');
      icon.classList.replace('fa-xmark', 'fa-bars');
    });
  });

  // Appointment & Modal Logic
  const form = document.getElementById('appointmentForm');
  const passModal = document.getElementById('passModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const doneBtn = document.getElementById('doneBtn');
  const printBtn = document.getElementById('printBtn');

  function openModal() {
    passModal.classList.remove('hidden');
    passModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    passModal.classList.add('hidden');
    passModal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if(modalOverlay) modalOverlay.addEventListener('click', closeModal);
  if(doneBtn) doneBtn.addEventListener('click', closeModal);
  if(printBtn) printBtn.addEventListener('click', () => window.print());

  if(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const fullName = document.getElementById('fullName').value.trim();
      const contact = document.getElementById('contact').value.trim();
      const service = document.getElementById('service').value;
      const apptDate = document.getElementById('apptDate').value;

      let formattedDateTime = '—';
      if (apptDate) {
        const dt = new Date(apptDate);
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        formattedDateTime = dt.toLocaleDateString('en-PH', options);
      }

      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let randomPart = '';
      for (let i = 0; i < 6; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const refCode = 'RAD-' + randomPart;

      const qrData = `R.A. DANTES CLINIC|Ref:${refCode}|Patient:${fullName}|Service:${service}|Date:${formattedDateTime}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

      document.getElementById('qrCodeImg').src = qrUrl;
      document.getElementById('refCode').textContent = refCode;
      document.getElementById('modalPatientName').textContent = fullName;
      document.getElementById('modalService').textContent = service;
      document.getElementById('modalDateTime').textContent = formattedDateTime;

      openModal();
    });
  }

  // Set default date
  const dtInput = document.getElementById('apptDate');
  if (dtInput) {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 1);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    dtInput.value = `${year}-${month}-${day}T${hours}:00`;
  }
});
