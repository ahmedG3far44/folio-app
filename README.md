# **Folio** 🚀

A web app for tech professionals to **build customized portfolios** showcasing projects, skills, and experiences with full CRUD functionality, theme and layout sections customization.

**Live Demo**: [Coming Soon]() _(Share URL if deployed)_

---

## **Features** ✨

- **Personal Info**: Name, job title, resume upload, "About" section.
- **Experiences**: CRUD operations for roles (company logo, name, position, duration, location).
- **Projects**: CRUD for projects (title, description, tags, source URL, thumbnail, images).
- **Skills**: CRUD for skills (logo, name).
- **Customization**:
  - Layout control (hero, experiences, projects, skills, feedback sections).
  - Theme color switching.
- **Authentication**: JWT-based user login/signup.

---

## **Tech Stack** 🛠️

| **Category**   | **Choices**                 |
| -------------- | --------------------------- |
| Frontend       | React.js                    |
| Backend        | Express.js                  |
| Database/ORM   | Postgres + Prisma (Neon DB) |
| Authentication | JWT                         |
| Styling        | TailwindCSS & Shadcn        |

---

## **Setup Locally** 🛠️

### **Prerequisites**

- Node.js (v18+)
- PostgreSQL (or Neon DB connection)
- Git

### **Steps**

1. **Clone the repo**:

   ```bash
   git clone -b development https://github.com/ahmedG3far44/Folio-App.git
   cd Folio-App
   ```

2. **Install dependencies**:

   ```bash
   # Frontend
   cd frontend && npm install
   # Backend
   cd ../server && npm install
   ```

3. **Set up environment variables**:

- Create `.env` in `/server`:
  ```env
  PORT=5000
  ENV=development # or "production"
  LOCAL_CLIENT_URL=http://localhost:3000
  PRODUCTION_CLIENT_URL=https://your-deployed-frontend-url.com
  AWS_S3_ACCESS_SECRETE_KEY=your_aws_s3_secret_key
  AWS_S3_ACCESS_KEY=your_aws_s3_access_key
  AWS_S3_REGION=your_s3_region (e.g., us-east-1)
  AWS_S3_BUCKET_NAME=your_s3_bucket_name
  AWS_S3_BUCKET_DOMAIN=your_s3_bucket_domain (e.g., https://bucket-name.s3.amazonaws.com)
  DATABASE_URL=your_postgres_or_neon_db_url
  ACCESS_TOKEN_SECRET=your_jwt_secret_key
  HOST_DOMAIN_URL=http://localhost:5000 # or your production backend URL
  ```
- Create `.env` in `/frontend`:
  ```env
  VITE_URL_SERVER=http://localhost:5000 # or your production backend URL
  VITE_BUCKET_DOMAIN=your_s3_bucket_domain (e.g., https://{bucket-name}.s3.amazonaws.com)
  VITE_LOCAL_DOMAIN=http://localhost:3000
  VITE_PRODUCTION_DOMAIN=https://{your-deployed-frontend-url}.com
  VITE_ENV=development # or "production"
  ```

4. **Database Setup**:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the app**:
   ```bash
   # Frontend (frontend/)
   npm run dev
   # Backend (server/)
   npm start
   ```
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:4000`

---

## **Project Structure** 📂

```
folio/
├── frontend/
    ├── public
    ├── src
        ├── assests
        ├── components
        ├── context
        ├── pages
        ├── lib
   |── .env

├── server/
    ├── src
        ├── database
        ├── routes
        ├── middlewares
        ├── prisma
        ├── utils
        ├── s3
    ├── .env

```

---

# **API Endpoints Documentation**

## **Base URL**

```
http://{localhost:4000}/api/
```

## Authentication Endpoints

### Auth

- **POST** `/auth/login` - User login
- **POST** `/auth/register` - User registration

### User

- **GET** `/user` - Get user information


### Admin

- **GET** `/admin` - Get admin insights


## Profile Information

### Upload Hero Image

- **POST** `/upload-hero-image` - Upload hero image
- **POST** `/upload-files` - Upload files

### Resume

- **GET** `/resume` - Get resume information
- **POST** `/resume` - Create resume
- **PUT** `/resume/:id` - Update resume (requires ID parameter)

### Bio

- **GET** `/bio/:id` - Get bio by ID
- **PUT** `/bio/:id` - Update bio (requires ID parameter)

### Skills

- **GET** `/skills` - Get all skills
- **GET** `/skills/:id` - Get skill by ID
- **POST** `/skills` - Create new skill
- **PUT** `/skills/:id` - Update skill (requires ID parameter)
- **DELETE** `/skills/:id` - Delete skill (requires ID parameter)

### Experiences

- **GET** `/exp` - Get all experiences
- **GET** `/exp/:id` - Get experience by ID
- **POST** `/experience` - Create new experience
- **PUT** `/experience/:id` - Update experience (requires ID parameter)
- **DELETE** `/experience/:id` - Delete experience (requires ID parameter)

### Projects

- **GET** `/project` - Get all projects
- **GET** `/project/:id` - Get project by ID
- **POST** `/project` - Create new project
- **PUT** `/project/:id` - Update project (requires ID parameter)
- **DELETE** `/project/:id` - Delete project (requires ID parameter)

### Themes

- **GET** `/theme` - Get theme information
- **POST** `/theme` - Create new theme
- **PUT** `/theme/:id` - Update theme (requires ID parameter)
- **DELETE** `/theme/:id` - Delete theme (requires ID parameter)

### Feedback

- **GET** `/feedback` - Get all feedback
- **POST** `/feedback` - Create new feedback
- **DELETE** `/feedback/:id` - Delete feedback (requires ID parameter)

### Contacts

- **GET** `/contacts` - Get all contacts
- **PUT** `/contacts/:id` - Update contact (requires ID parameter)

### Layouts

- **GET** `/layouts` - Get layout information
- **PUT** `/layouts/:id` - Update layout (requires ID parameter)

---


## **Screenshots** 📸 (Preview App):

<img src="https://github.com/ahmedG3far44/Folio-App/blob/development/showcase.gif"  alt="show case gif image" />
