<template>
  <aside
    class="sidebar d-flex flex-column p-3"
    :class="{ collapsed: isCollapsed }"
  >
    <!-- HEADER -->
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h5 v-if="!isCollapsed" class="fw-bold text-orange mb-0">Admin</h5>

      <button class="btn btn-sm btn-light toggle-btn" @click="toggleSidebar">
        <Icon
          :name="isCollapsed ? 'mdi:menu-open' : 'mdi:menu'"
          size="20"
          style="display: block"
        />
      </button>
    </div>

    <!-- NAV -->
    <ul class="nav nav-pills flex-column gap-2">

      <NuxtLink to="/admin" class="nav-link" title="Dashboard">
        <Icon name="mdi:view-dashboard" />
        <span v-if="!isCollapsed">Dashboard</span>
      </NuxtLink>

      <NuxtLink to="/admin/bookings" class="nav-link" title="Bookings">
        <Icon name="mdi:calendar-check" />
        <span v-if="!isCollapsed">Bookings</span>
      </NuxtLink>

<<<<<<< HEAD
        <NuxtLink to="/admin/cabin" class="nav-item d-flex align-items-center gap-2">
          <Icon name="mdi:bed" />
          Cabins
        </NuxtLink>
=======
      <NuxtLink to="/admin/rooms" class="nav-link" title="Rooms">
        <Icon name="mdi:bed" />
        <span v-if="!isCollapsed">Rooms</span>
      </NuxtLink>
>>>>>>> fffd9687b6f06c74d330effa86dfa094d4e39ac3

      <NuxtLink to="/admin/inventory" class="nav-link" title="Inventory">
        <Icon name="mdi:clipboard-list" />
        <span v-if="!isCollapsed">Inventory</span>
      </NuxtLink>

      <NuxtLink to="/admin/today" class="nav-link" title="Today">
        <Icon name="mdi:clock-outline" />
        <span v-if="!isCollapsed">Today</span>
      </NuxtLink>

      <NuxtLink to="/admin/availability" class="nav-link" title="Availability">
        <Icon name="mdi:calendar-month" />
        <span v-if="!isCollapsed">Availability</span>
      </NuxtLink>

    </ul>
  </aside>
</template>

<script setup>
import { onMounted } from "vue";
import { useSidebar } from "@/composables/useSidebar";

const { isCollapsed } = useSidebar();

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;

  localStorage.setItem(
    "sidebar",
    isCollapsed.value ? "collapsed" : "expanded"
  );
};

onMounted(() => {
  const saved = localStorage.getItem("sidebar");
  isCollapsed.value = saved === "collapsed";
});
</script>

<style scoped>
/* SIDEBAR */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 100vh;
  background: #fff;
  border-right: 1px solid #eee;
  transition: all 0.25s ease;
  z-index: 1000;
}

/* COLLAPSED */
.sidebar.collapsed {
  width: 70px;
}

/* NAV LINK */
.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  color: #555;
  text-decoration: none;
  transition: all 0.2s ease;
}

/* ICON FIX */
.nav-link > *:first-child {
  min-width: 22px;
  display: flex;
  justify-content: center;
}

/* HOVER */
.nav-link:hover {
  background: #f5f5f5;
}

/* ACTIVE */
.router-link-active {
  background: #ffe9e0;
  color: #ff6b2c !important;
  font-weight: 500;
}

/* COLLAPSED MODE */
.sidebar.collapsed .nav-link {
  justify-content: center;
  gap: 0;
  padding: 10px 0;
  width: 100%;
  height: 48px;
  margin: 0;
}

.sidebar.collapsed .nav-link > * {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.sidebar.collapsed .nav-link > *:first-child {
  min-width: 22px;
  width: 22px;
  margin: 0;
}

.sidebar.collapsed .nav-link svg,
.sidebar.collapsed .nav-link > *:first-child svg {
  width: 20px !important;
  height: 20px !important;
  display: block !important;
}

/* HIDE TEXT ONLY */
.sidebar.collapsed span {
  display: none;
}

/* ACTIVE (CIRCLE STYLE) */
.sidebar.collapsed .router-link-active {
  background: #ff6b2c;
  color: #fff !important;
}

/* TOGGLE BUTTON */
.toggle-btn {
  border-radius: 10px;
  width: 40px;
  min-width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333 !important;
  background-color: #f5f5f5 !important;
  border-color: #d8d8d8 !important;
}

/* CENTER BUTTON WHEN COLLAPSED */
.sidebar.collapsed .toggle-btn {
  margin: 0 auto;
}

/* FORCE ICON VISIBILITY */
.toggle-btn svg {
  width: 20px !important;
  height: 20px !important;
  display: block !important;
}
</style>