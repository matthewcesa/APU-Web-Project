<template>
  <footer class="footer">
    <div class="footer-content">
      <div>
        <h3>Navigation</h3>
        <p>Home</p>
        <p>All Courses</p>
        <p>About</p>
        <p>Help</p>
      </div>

      <div>
        <h3>Resources</h3>
        <p>Documentation</p>
        <p>Technical Support</p>
        <p>Privacy Policy</p>
        <p>Terms of Service</p>
      </div>

      <div>
        <h3>Contact</h3>
        <p>Address : Somewhere over the rainbow <br /></p>
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
</style>
