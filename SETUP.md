# HAYH GANG — Setup

## Requisitos
- Node.js 18+
- MongoDB Community (local) OU MongoDB Atlas

## Backend
```bash
cd backend
npm install
npm run dev        # Porta 5000
```

## Popular banco de dados (primeira vez)
```bash
cd backend
npx ts-node src/seed.ts
```

## Frontend
```bash
cd frontend
npm install
npm run dev        # Porta 5173
```

## Acessar o site
- Site: http://localhost:5173
- Admin: http://localhost:5173/admin (precisa isAdmin: true no MongoDB)

## Virar Admin
No MongoDB Compass ou Atlas, encontre seu usuário e mude `isAdmin: false` para `isAdmin: true`.

## URLs importantes
- Instagram: https://www.instagram.com/hayhgang/
- WhatsApp VIP: https://wa.me/7192055641
