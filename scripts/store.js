/**
 * store.js
 * Shared localStorage data layer for Nafasi Spaces.
 * There is no backend yet, so this file acts as a stand-in "database".
 * Include this script BEFORE any page-specific script (script.js, new-acc.js, form.js, admin.js).
 *
 * NOTE: Passwords are stored in plain text in localStorage. This is fine for a
 * school project prototype, but should never be done in a real production app —
 * once a backend exists, replace this with real authentication (hashed passwords,
 * server-side sessions, etc).
 */

const USERS_KEY = "nafasi_users";
const LISTINGS_KEY = "nafasi_listings";
const BOOKINGS_KEY = "nafasi_bookings";
const SESSION_KEY = "nafasi_session";

// Small UUID fallback for environments where crypto.randomUUID() is unavailable
function uuid() {
    try {
        if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    } catch (e) {
        // ignore and fall through
    }
    return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/* ---------------------------- Users ---------------------------- */

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (err) {
        console.error('Failed to save users to localStorage', err);
    }
}

function findUserByEmail(email) {
    if (!email) return undefined;
    const needle = String(email).toLowerCase();
    return getUsers().find((u) => u.email && u.email.toLowerCase() === needle);
}

function addUser({ firstName, lastName, email, password, role = "user" }) {
    const users = getUsers();
    if (findUserByEmail(email)) {
        console.warn('Attempted to add duplicate user:', email);
        return false;
    }

    users.push({
        id: uuid(),
        firstName,
        lastName,
        email,
        password,
        role,
        createdAt: new Date().toISOString(),
    });
    saveUsers(users);
    return true;
}

/** Seeds one default admin account the first time the site is ever loaded. */
function seedAdmin() {
    const users = getUsers();
    const hasAdmin = users.some((u) => u.role === "admin");
    if (!hasAdmin) {
        users.push({
            id: uuid(),
            firstName: "Ryan",
            lastName: "Chiwo",
            email: "chiworyan@gmail.com",
            password: "Chiwo123!",
            role: "admin",
            createdAt: new Date().toISOString(),
        });
        saveUsers(users);
    }
}

/* --------------------------- Session ---------------------------- */

function getSession() {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch {
        return null;
    }
}

function setSession({ id, email, role, firstName }) {
    try {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ id, email, role, firstName }));
    } catch (err) {
        console.error('Failed to set session in localStorage', err);
    }
}

function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

/** Redirects to login.html unless the current session is an admin. Call at the top of admin pages. */
function requireAdmin() {
    const session = getSession();
    if (!session || session.role !== "admin") {
        window.location.href = "login.html";
    }
    return session;
}

/* -------------------------- Listings ---------------------------- */

function getListings() {
    return JSON.parse(localStorage.getItem(LISTINGS_KEY)) || [];
}

function saveListings(listings) {
    try {
        localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
    } catch (err) {
        console.error('Failed to save listings to localStorage', err);
    }
}

/** Seeds the listings that currently exist as hardcoded HTML in browse.html, the first time the site loads. */
function seedListings() {
    if (localStorage.getItem(LISTINGS_KEY)) return;

    const seed = [
        { title: "Uhuru Park", category: "Leisure", location: "Nairobi CBD", price: 1500, description: "A 12.9 hectare recreational park adjacent to Nairobi's CBD, with an artificial lake and open grounds." },
        { title: "Arboretum", category: "Leisure", location: "Nairobi", price: 1200, description: "A quiet, tree-filled park ideal for picnics and relaxed outdoor time." },
        { title: "Case spaces", category: "Leisure", location: "Nairobi", price: 2000, description: "A relaxed leisure space suited for casual gatherings." },
        { title: "Hidden Gardens", category: "Leisure", location: "Nairobi", price: 1800, description: "A peaceful garden setting perfect for picnics and nature lovers." },
        { title: "Oval", category: "Workspace", location: "Nairobi", price: 3500, description: "A professional office-style space suited for focused work." },
        { title: "GTC Spaces", category: "Workspace", location: "Nairobi", price: 4000, description: "Modern co-working floors in a well-known Nairobi office tower." },
        { title: "Parkside towers", category: "Workspace", location: "Nairobi", price: 3800, description: "Office space with park views, good for small teams." },
        { title: "Ebenezer-Spaces", category: "Workspace", location: "Nairobi", price: 3000, description: "Affordable shared workspace for freelancers and small teams." },
        { title: "I&M pentspaces", category: "Workspace", location: "Nairobi", price: 4500, description: "Premium penthouse-level workspace with city views." },
        { title: "Teja spaces", category: "Workspace", location: "Nairobi", price: 3200, description: "Flexible desks and meeting rooms for daily or weekly rental." },
        { title: "Jamhuri show-grounds", category: "Events", location: "Nairobi", price: 15000, description: "Large open grounds suited for exhibitions and big events." },
        { title: "Nairobi Street Kitchen", category: "Events", location: "Nairobi", price: 8000, description: "A lively venue with food and entertainment, good for social events." },
        { title: "The Alchemist", category: "Events", location: "Nairobi", price: 10000, description: "A popular venue with an outdoor market and live entertainment." },
        { title: "Mass-house Ngong Racecourse", category: "Events", location: "Nairobi", price: 20000, description: "A large-capacity venue for major events and shows." },
        { title: "Bouganvelia Gardens", category: "Leisure", location: "Nairobi", price: 1600, description: "A perfect space for picnics or enjoying the ambience of nature." },
        { title: "Cozy spaces", category: "Workspace", location: "Nairobi", price: 2500, description: "Work from the comfort of a cozy, home-like environment." },
    ];

    const listings = seed.map((item) => ({
        id: uuid(),
        image: "",
        ...item,
    }));

    saveListings(listings);
}

function addListing(listing) {
    const listings = getListings();
    listings.push({ id: uuid(), ...listing });
    saveListings(listings);
}

function updateListing(id, updates) {
    const listings = getListings().map((l) => (l.id === id ? { ...l, ...updates } : l));
    saveListings(listings);
}

function deleteListing(id) {
    saveListings(getListings().filter((l) => l.id !== id));
}

/* -------------------------- Bookings ---------------------------- */

function getBookings() {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || [];
}

function saveBookings(bookings) {
    try {
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    } catch (err) {
        console.error('Failed to save bookings to localStorage', err);
    }
}

function addBooking(booking) {
    const bookings = getBookings();
    bookings.push({
        id: uuid(),
        createdAt: new Date().toISOString(),
        ...booking,
    });
    saveBookings(bookings);
}

function deleteBooking(id) {
    saveBookings(getBookings().filter((b) => b.id !== id));
}

/* Run seeding on every page that includes this script. */
seedAdmin();
seedListings();
