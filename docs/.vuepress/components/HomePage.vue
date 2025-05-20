<!-- .vuepress/components/HomePage.vue -->
<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <h1 class="welcome-title">Система контролю проєктів</h1>
      <p class="welcome-description">Вітаємо у системі для ефективного керування та моніторингу проєктів</p>
      <router-link to="/intro/" class="start-button">
        Почати
        <i class="material-icons start-icon">arrow_forward</i>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 2rem;
  text-align: center;
}

.welcome-content {
  max-width: 600px;
}

.welcome-title {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #3eaf7c;
}

.welcome-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #4e6e8e;
}

.start-button {
  display: inline-block;
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  background-color: #3eaf7c;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.start-icon {
  font-size: 1.2rem;
}

.start-button:hover {
  background-color: #2c8b5f;
}
</style>