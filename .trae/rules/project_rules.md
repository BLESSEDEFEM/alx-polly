---
description: Applies general rules on folder structure, form libraries and Supabase usage
alwaysApply: true
---

## Project Context
You are working on the *Polling App with QR Code Sharing*, built with Next.js (App Router), Supabase, TailwindCSS and Shadcn/ui.

## Folder structure
 
- All API logic should be co-located in the /app/api folder 
- Polls should stored in /app/polls/ with dynamic routes 
- Each Poll includes question, options[], createdBy, createdAt, and optional expiresAt (Planned) 
- Each poll can be shared via a unique URL and eventually a QR code

## Form libraries

- Forms should use react-hook-form, styled with shadcn/ui

## Database

- Supabase should be used for auth and database
- Polls should be stored in a Supabase table with columns: id, question, options[], createdBy, createdAt, expiresAt
