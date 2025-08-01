# Admin Settings Pages

This folder contains all the settings-related pages for the admin panel. Each page is fully functional, responsive, and integrated with the admin system.

## Pages Overview

### 1. GeneralSettings.js
- **Purpose**: Configure general admin panel settings and preferences
- **Features**:
  - Site information management
  - Display settings (date format, time format, language)
  - System settings (maintenance mode, debug mode, auto backup)
  - File upload settings
  - Session timeout configuration

### 2. SecuritySettings.js
- **Purpose**: Manage security and authentication settings
- **Features**:
  - Password change functionality
  - Security activity logs
  - Session management
  - Security statistics
  - Logout all sessions

### 3. ProfileSettings.js
- **Purpose**: Update admin profile information and preferences
- **Features**:
  - Profile picture upload/management
  - Personal information editing
  - Social media links
  - Notification preferences
  - Dark mode toggle

### 4. SiteConfiguration.js
- **Purpose**: Configure site-wide settings and SEO
- **Features**:
  - SEO settings (meta tags, keywords, canonical URLs)
  - Social media integration
  - Contact information
  - Analytics configuration
  - Site performance settings

## Features

### Responsive Design
- All pages are fully responsive and work on mobile, tablet, and desktop
- Optimized layouts for different screen sizes
- Touch-friendly interface elements

### Form Validation
- Real-time validation for all input fields
- Error handling and user feedback
- Loading states and success messages

### Data Persistence
- Settings are saved to localStorage (can be easily changed to API calls)
- Form state management with change detection
- Reset functionality to restore previous settings

### Dark Mode Support
- All pages support dark mode
- Consistent theming across the admin panel
- Automatic theme detection

## Usage

### Navigation
Access these pages through the admin sidebar under the "Settings" section:
- General Settings: `/admin/settings`
- Security Settings: `/admin/settings/security`
- Profile Settings: `/admin/settings/profile`
- Site Configuration: `/admin/settings/site`

### Integration
These pages are automatically integrated into the admin routing system and will be available once the admin panel is loaded.

## Customization

### Adding New Settings
To add new settings to any page:
1. Add the new field to the state object
2. Create the corresponding form element
3. Add validation if needed
4. Update the save/load functions

### Styling
All pages use Tailwind CSS classes and follow the admin panel design system. Custom styling can be added by modifying the className props.

### API Integration
Currently, settings are saved to localStorage. To integrate with a backend API:
1. Replace the localStorage calls with API calls
2. Add proper error handling
3. Implement loading states for API operations

## Dependencies

- React (with hooks)
- React Icons (Heroicons)
- Tailwind CSS
- Firebase (for authentication in SecuritySettings)

## File Structure

```
settings/
├── index.js              # Export file for cleaner imports
├── GeneralSettings.js    # General admin settings
├── SecuritySettings.js   # Security and authentication
├── ProfileSettings.js    # Admin profile management
├── SiteConfiguration.js  # Site-wide configuration
└── README.md            # This documentation
``` 