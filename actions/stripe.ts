"use server"

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SK as string)

export async function checkout(email: string, priceId: string, redirect: string) {
    return JSON.stringify(await stripe.checkout.sessions.create({
        success_url: redirect || process.env.SITE_URL,
        cancel_url: process.env.SITE_URL,
        customer_email: email,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
    }))
}