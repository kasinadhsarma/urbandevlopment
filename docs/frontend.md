# Frontend Technical Documentation

## Overview

The frontend of the UrbanDev AI project is built using React and Next.js. It provides a user-friendly interface for interacting with various features of the application, including traffic prediction, urban analysis, and sustainability metrics.

## Architecture

The frontend architecture is organized into several key components and pages, each serving a specific purpose. The main components include:

- **Pages**: These are the main views of the application, such as the home page, dashboard, and sustainability page.
- **Components**: Reusable UI elements that are used across different pages, such as buttons, cards, and charts.
- **Contexts**: Used for state management, providing a way to share state across different components.

## Key Pages

### Home Page

The home page (`app/page.tsx`) serves as the entry point for users. It includes a hero section, stats section, features section, and footer.

- **Hero Section**: Includes a background gradient, animated elements, and a call-to-action button.
- **Stats Section**: Displays key statistics using `StatsCard` components.
- **Features Section**: Highlights key features using `FeatureCard` components.
- **Footer**: Provides navigation links and contact information.

### Dashboard Page

The dashboard page (`app/dashboard/page.tsx`) provides an overview of various metrics related to traffic flow, sustainability, and urban analysis.

- **MetricCard Component**: Displays individual metrics with progress bars and status indicators.
- **ActionButton Component**: Provides quick action buttons for navigating to different sections.
- **StatusItem Component**: Displays the status of various system components.

### Sustainability Page

The sustainability page (`app/dashboard/sustainability/page.tsx`) provides detailed metrics and analysis related to sustainability initiatives.

- **MetricCard Component**: Displays individual sustainability metrics with visual indicators and progress bars.
- **CustomTooltip Component**: Custom tooltip for charts to display detailed information on hover.
- **Sustainability Component**: Main component that fetches and displays sustainability metrics, including loading and error handling.

### Prediction Page

The prediction page (`app/dashboard/predict/page.tsx`) allows users to input parameters for traffic prediction and view the results.

- **Form Handling**: Uses state management to handle form inputs and submission.
- **API Call**: Fetches prediction results from the backend API.
- **Result Display**: Displays prediction results and recommendations.

### Result Page

The result page (`app/dashboard/result/page.tsx`) displays the detailed analysis and recommendations based on the traffic prediction.

- **MetricCard Component**: Displays key metrics with progress bars.
- **Charts**: Uses Recharts to display hourly traffic distribution and historical accuracy.
- **Recommendations**: Lists actionable recommendations based on the prediction results.

### Urban Analysis Page

The urban analysis page (`app/dashboard/urban-analysis/page.tsx`) provides detailed metrics and analysis related to urban infrastructure.

- **Map Component**: Displays a dynamic map view of the selected area.
- **MetricCard Component**: Displays key metrics with visual indicators.
- **Charts**: Uses Recharts to display historical trends.
- **Optimization Suggestions**: Lists actionable suggestions for urban optimization.

### Traffic Flow Page

The traffic flow page (`app/dashboard/traffic-flow/page.tsx`) allows users to input parameters for traffic analysis and view the results.

- **Form Handling**: Uses state management to handle form inputs and submission.
- **API Call**: Fetches traffic analysis results from the backend API.
- **Result Display**: Displays analysis results and feature importance.

## State Management

The frontend uses React Context and Hooks for state management. This approach allows for efficient state sharing across different components without the need for prop drilling.

### Sidebar Context

The `SidebarContext` (`app/contexts/SidebarContext.tsx`) manages the state of the sidebar, including whether it is open or closed.

- **State**: `isOpen` (boolean) - Indicates whether the sidebar is open.
- **Actions**: `toggle` - Toggles the sidebar open/closed state.
- **Provider**: `SidebarProvider` - Wraps the application to provide sidebar state to all components.

### User Context

The `UserContext` (`app/contexts/UserContext.tsx`) manages the state of the user, including user information and preferences.

- **State**: `user` (object) - Stores user information such as ID, name, and email.
- **Actions**: `setUser` - Updates the user information.
- **Provider**: `UserProvider` - Wraps the application to provide user state to all components.

## Conclusion

This documentation provides an overview of the frontend architecture, key pages, and state management approach used in the UrbanDev AI project. The frontend is designed to be modular and reusable, with a focus on providing a seamless user experience.
