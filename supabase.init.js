// supabase.init.js

import { createClient } from '@supabase/supabase-js';

// Créez un seul client Supabase pour interagir avec votre base de données
const supabaseUrl = 'https://kvtvfombqppotwassfkb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2dHZmb21icXBwb3R3YXNzZmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkyMzA2MzQsImV4cCI6MjAzNDgwNjYzNH0.Th0zso1QlnfSQlgYCrimJk6MYgIa8xVOy14Nm59196s'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;
