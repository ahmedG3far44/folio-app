# **Folio** 🚀  

A web app for tech professionals to **build customized portfolios** showcasing projects, skills, and experiences with full CRUD functionality and theme customization.  

**Live Demo**: [Coming Soon]() *(Share URL if deployed)*  


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
| **Category**       | **Choices**                  |  
|--------------------|------------------------------|  
| Frontend           | React.js                     |  
| Backend            | Express.js                   |  
| Database/ORM       | Postgres + Prisma (Neon DB)  |  
| Authentication     | JWT                          |  
| Styling            | TailwindCSS & Shadcn         |  

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
   cd client && npm install  
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
   # Frontend (client/)  
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

## **Screenshots** 📸 (Preview App):  


<img src="https://github.com/ahmedG3far44/Folio-App/blob/development/showcase.gif"  alt="show case gif image" />

