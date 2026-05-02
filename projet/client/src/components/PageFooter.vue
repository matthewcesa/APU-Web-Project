<template>
  <footer class="footer">
    <div class="footer-content">
      <div>
        <h3>Navigation</h3>
        <p><RouterLink to="/about-project">About the Project</RouterLink></p>
        <p><RouterLink to="/about-team">About our Team</RouterLink></p>
      </div>

      <div>
        <h3>Resources</h3>
        <p>Nothing</p>
        <p>To</p>
        <p>Click on</p>
        <p>Here</p>
      </div>

      <div>
        <h3>Contact</h3>
        <p>Address : M Vertica for now !<br /></p>
        <p>+00 11 22 33 44 55</p>
        <p>contact@mcqoodle.com</p>
      </div>
    </div>

    <div class="footer-bottom">© 2026 MCQoodle. All rights reserved.</div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: 4rem;
  padding: 3rem 12%;
  background: #f0f0f4;
  color: #747789;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid #ffffff;
}

.footer h3 {
  margin: 0 0 1rem;
  color: rgb(54, 54, 54);
  font-size: 1rem;
}

.footer p {
  margin: 0.7rem 0;
  line-height: 1.5;
}

.footer-bottom {
  padding-top: 2rem;
  text-align: center;
  color: #a4a4a4;
}

@media (max-width: 1024px) {
  .footer {
    padding: 2.5rem 8%;
  }

  .footer-content {
    gap: 3rem;
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 2rem 4%;
  }

  .footer-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  .footer h3 {
    font-size: 0.95rem;
    margin-bottom: 0.8rem;
  }

  .footer p {
    font-size: 0.9rem;
    margin: 0.5rem 0;
  }

  .footer-bottom {
    padding-top: 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 600px) {
  .footer {
    padding: 1.5rem 3%;
    margin-top: 2rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .footer h3 {
    font-size: 0.9rem;
    margin-bottom: 0.6rem;
  }

  .footer p {
    font-size: 0.85rem;
    margin: 0.4rem 0;
  }

  .footer-bottom {
    padding-top: 1rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .footer {
    padding: 1rem 2%;
    margin-top: 1.5rem;
  }

  .footer-content {
    gap: 1rem;
  }

  .footer h3 {
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  }

  .footer p {
    font-size: 0.8rem;
    margin: 0.3rem 0;
    line-height: 1.4;
  }

  .footer-bottom {
    padding-top: 0.8rem;
    font-size: 0.75rem;
  }
}
</style>
