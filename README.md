# 🍽️ HungerConnect

HungerConnect is a web platform designed to **reduce food waste and help people in need** by connecting food donors with volunteers and organizations that distribute food to the hungry.

## 🌟 Features

* 🍛 **Food Donation System** – Donors can register and submit food donations.
* 📍 **Location Picker** – Helps volunteers find donation locations easily.
* 👥 **Volunteer Dashboard** – Volunteers can track and manage food pickups.
* 📊 **Donation History** – Track previous donations and activity.
* 🎁 **Rewards System** – Donors earn rewards for contributing.
* 🔐 **User Authentication** – Secure login and registration system.

## 🛠️ Tech Stack

* **Frontend:** React + TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Backend / Database:** Supabase
* **Testing:** Vitest

## 📂 Project Structure
hungerconnect
│
├── public/
│   └── robots.txt
│
├── src/
│   │
│   ├── components/
│   │   ├── DonationForm.tsx
│   │   ├── DonationHistory.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroCarousel.tsx
│   │   ├── LocationPicker.tsx
│   │   ├── NavLink.tsx
│   │   ├── Navbar.tsx
│   │   ├── RewardsModal.tsx
│   │   ├── VolunteerDonations.tsx
│   │   │
│   │   └── ui/
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── checkbox.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       └── many other UI components
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── types.ts
│   │
│   ├── lib/
│   │   └── utils.ts
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Index.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── NotFound.tsx
│   │
│   ├── test/
│   │   ├── example.test.ts
│   │   └── setup.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── supabase/
│   └── migrations/
│       ├── migration1.sql
│       ├── migration2.sql
│       └── migration3.sql
│
├── index.html
├── package.json
├── bun.lock
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── postcss.config.js
├── eslint.config.js
├── components.json
└── env.txt

## 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/Jyotsnasree-21/hungerconnect.git
```

Go to the project folder:

```bash
cd hungerconnect
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The project will start on:

```
http://localhost:5173
```
Deployed link:
https://hungerconnect.lovable.app

## 🌍 Future Improvements

* Real-time donation tracking
* NGO integration
* Mobile application
* AI-based food demand prediction

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the project and submit a pull request.

## 📄 License

This project is licensed under the MIT License.

---

### 👩‍💻 Author

**Jyotsnasree**
GitHub: https://github.com/Jyotsnasree-21
