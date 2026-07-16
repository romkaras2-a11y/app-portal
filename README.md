
# AppPortal

## Application Description

The Online Job Application Portal is a modern Angular application that enables users to browse available job openings and submit applications through a guided, user-friendly process.

The application includes:

* A landing page displaying current job vacancies.
* A multi-step application form built with Angular Reactive Forms.
* Comprehensive client-side form validation with meaningful validation messages.
* A file upload feature for submitting application documents such as a résumé and cover letter.
* A progress indicator that guides users through each step of the application process.
* A responsive and accessible user interface designed for both desktop and mobile devices.

The project demonstrates modern Angular development practices, including reusable standalone components, Reactive Forms, routing, service-based architecture, and clean separation of concerns.


T## Features 

* Angular 22
* Standalone Components
* REST API integration
* Environment-based configuration
* Responsive user interface
* Unit tests with Vitest

## Requirements

* Node.js 20+
* npm
* Angular CLI

## Installation

Clone the repository:

```bash
git clone https://github.com/romkaras2-a11y/app-portal.git
cd app-quiz
```

Install dependencies:

```bash
npm install
```

## Development

The project uses Angular environments.

### Development Environment

`src/environments/environment.dev.ts`

Example:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4200/job-api/api/job-board-api/'
};
```

### Production Environment

`src/environments/environment.prod.ts`

Example:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://www.arbeitnow.com/api/job-board-api/?tag=PHP,javascript,frontend,munich&limit=20&page=1'
};
```

The application should access the backend using:

```typescript
environment.apiUrl
```

instead of hardcoded URLs.

## Running the application

Start the development server:

```bash
ng serve
```

Open:

```
http://localhost:4200
```

## Optional: Proxy Configuration

If you use a local backend, you can configure a proxy (`proxy.conf.json`) and use relative API paths during development.

Example:

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

Run Angular with:

```bash
ng serve --proxy-config proxy.conf.json
```

## Build

Development build:

```bash
ng build
```

Production build:

```bash
ng build --configuration production
```

## Testing

Run unit tests:

```bash
ng test
```

## Project Structure

```text
src/
 ├── app/
 ├── environments/
 │    ├── environment.dev.ts
 │    └── environment.prod.ts
 ├── assets/
 └── styles/
```

---
## 📝 Lizenz

MIT License - Freie Nutzung für private und kommerzielle Zwecke.

## Author

Roman Karas
