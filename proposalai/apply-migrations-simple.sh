#!/bin/bash

echo "=================================================="
echo "  ProposifyAI - Database Migration Application"
echo "=================================================="
echo ""

SUPABASE_URL="https://xmwnlgnfljufviigrois.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtd25sZ25mbGp1ZnZpaWdyb2lzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTM4MTY1NCwiZXhwIjoyMDc2OTU3NjU0fQ.B4oscpvlIBd8GDIsr6qhj51fgumHemPZ_6hkMIEx3lo"

echo "📋 Migration SQL Commands:"
echo ""
echo "Please execute these SQL commands in the Supabase SQL Editor:"
echo "https://supabase.com/dashboard/project/xmwnlgnfljufviigrois/editor"
echo ""
echo "=================================================="
echo "MIGRATION 1: saved_content table"
echo "=================================================="
cat supabase/migrations/20251026000004_saved_content.sql
echo ""
echo ""
echo "=================================================="
echo "MIGRATION 2: formatting_preferences table"
echo "=================================================="
cat supabase/migrations/20251026000005_formatting_preferences.sql
echo ""
echo "=================================================="
echo "✅ Copy the SQL above and run in Supabase dashboard"
echo "=================================================="
