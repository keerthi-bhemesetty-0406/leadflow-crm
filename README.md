# 🚀 LeadFlow CRM - Full Stack Lead Management System

A high-performance Lead Management System (Mini CRM) designed to streamline customer acquisition and data tracking. This project demonstrates a production-ready approach to handling business leads with a focus on Data Integrity, Intuitive UI/UX, and System Scalability.

---

## 🌟 Key Features

* **Real-Time Dashboard**: Instant insights into total leads, new prospects, and conversion metrics.
* **Full CRUD Operations**: Efficiently Add, View, Update, and Delete lead records via a custom Node.js API.
* **Smart Validation**:
    * Strict **10-digit phone number** enforcement.
    * **Duplicate Prevention**: Backend logic ensures no two leads share the same phone number.
* **Advanced Filtering (Bonus)**: Search by Name and filter by Status (New, Interested, Converted, Not Interested).
* **Premium UI**: A custom "Midnight Glass" dark mode interface featuring **Glassmorphism** and smooth React transitions.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Hooks, Axios, Responsive CSS) |
| **Backend** | Node.js & Express.js |
| **Database** | PostgreSQL |
| **Design** | Custom Glassmorphism UI |

---

## 🚀 Installation & Setup

### 1. Prerequisites
* **Node.js** (v14+)
* **PostgreSQL**

### 2. Clone the Repository
```bash
git clone [https://github.com/keerthi-bhemesetty-0406/leadflow-crm.git](https://github.com/keerthi-bhemesetty-0406/leadflow-crm.git)
cd leadflow-crm
```

### 3. Backend Setup
1.  Navigate to the `server` folder:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file with your database credentials:
    ```env
    DB_USER=your_user
    DB_PASSWORD=your_password
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=lead_management
    ```
4.  Start the server:
    ```bash
    npm start
    ```
    *(or `nodemon index.js` for development)*

### 4. Frontend Setup
1.  Navigate to the `client` folder:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the application:
    ```bash
    npm start
    ```
    
---

## 🧠 Problem-Solving Approach

* **Security**: Implemented backend-level validation to prevent invalid data entry regardless of frontend state.
* **User Experience**: Used "Loading" states and smooth scroll offsets to ensure a seamless navigation flow between dashboard and management views.
* **Performance**: Leveraged PostgreSQL indexing for fast lead retrieval and efficient status updates.

---

<img width="1366" height="768" alt="Screenshot from 2026-05-12 17-14-19" src="https://github.com/user-attachments/assets/babf9b25-d6b4-4f18-a08a-9e056b35b7f1" /> 

<img width="1366" height="768" alt="Screenshot from 2026-05-12 17-14-46" src="https://github.com/user-attachments/assets/a8cba7a3-ac66-455b-974d-89716445312b" />

<img width="1366" height="768" alt="Screenshot from 2026-05-12 17-15-02" src="https://github.com/user-attachments/assets/130b48f3-743c-492a-a35b-10fc5e3ba59b" />

<img width="1366" height="768" alt="Screenshot from 2026-05-12 17-15-12" src="https://github.com/user-attachments/assets/895523ad-154d-44ae-8edc-067bb933d079" />
