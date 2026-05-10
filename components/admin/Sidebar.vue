<template>
  <aside
    class="sidebar d-flex flex-column p-3"
    :class="{ collapsed: isCollapsed }"
  >
    <!-- HEADER -->
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h5 v-if="!isCollapsed" class="fw-bold text-orange mb-0">
        Janns Spring Resort
      </h5>

      <button
        class="btn btn-sm btn-light toggle-btn"
        @click="toggleSidebar"
      >
        <Icon
          :name="isCollapsed ? 'mdi:menu-open' : 'mdi:menu'"
          size="20"
          style="display: block"
        />
      </button>
    </div>

    <!-- NAV -->
    <ul class="nav nav-pills flex-column gap-2">
      <li v-for="item in menuItems" :key="item.to">
        <NuxtLink
          :to="item.to"
          class="nav-link"
          :title="item.label"
        >
          <Icon :name="item.icon" />

          <span v-if="!isCollapsed">
            {{ item.label }}
          </span>
        </NuxtLink>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSidebar } from "@/composables/useSidebar";

const router = useRouter();
const { isCollapsed } = useSidebar();

/* AUTO GENERATED MENU */
const menuItems = computed(() => {
  return router.options.routes
    .filter((route) => {
      return (
        route.path.startsWith("/admin") &&
        !route.path.includes(":") &&
        route.path !== "/admin/login"
      );
    })
    .map((route) => {
      const lastSegment =
        route.path === "/admin"
          ? "dashboard"
          : route.path.split("/").pop();

      return {
        label: formatLabel(lastSegment),
        to: route.path,
        icon: getIcon(lastSegment),
      };
    });
});

/* FORMAT LABEL */
const formatLabel = (text) => {
  return text
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

/* ICON MAPPING */
const getIcon = (name) => {
  const icons = {
    dashboard: "mdi:view-dashboard",
    bookings: "mdi:calendar-check",
    cabin: "mdi:bed",
    inventory: "mdi:clipboard-list",
    today: "mdi:clock-outline",
    availability: "mdi:calendar-month",
    reports: "mdi:file-chart",
    users: "mdi:account-group",
    settings: "mdi:cog",
  };

  return icons[name] || "mdi:circle-outline";
};

/* TOGGLE SIDEBAR */
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;

  localStorage.setItem(
    "sidebar",
    isCollapsed.value ? "collapsed" : "expanded"
  );
};

/* LOAD SAVED STATE */
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

/* ACTIVE STYLE */
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