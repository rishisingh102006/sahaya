# Supabase REST API & Database Schema Mapping Guide

**Project:** Sahaya — Senior Citizen & NGO Welfare Portal  
**Target:** Supabase PostgreSQL (`https://irjaenygiqfouidtayjt.supabase.co`)  
**Specification:** Complete field-by-field and endpoint-by-endpoint mapping.

---

## 1. Schema Mapping & Table Specifications

### Table: `public.users`
Stores user profile information for all three user roles (`senior`, `ngo`, `volunteer`).

| Field in API / JS Model | PostgreSQL Column | Data Type | Nullable | Description / Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `id` | TEXT | No | Primary key, prefixed format (`user-senior-*`, `user-ngo-*`, `user-vol-*`) |
| `name` | `name` | TEXT | No | Full display name |
| `email` | `email` | TEXT | No | Unique email address (lowercased) |
| `password` | `password` | TEXT | No | Bcrypt salted hash (never returned in responses) |
| `role` | `role` | TEXT | No | Role whitelist: `'senior'`, `'ngo'`, `'volunteer'` |
| `phone` | `phone` | TEXT | Yes | Primary mobile number |
| `gender` | `gender` | TEXT | Yes | `'male'`, `'female'`, `'other'` |
| `age` | `age` | INTEGER | Yes | Senior citizen or volunteer age |
| `address` | `address` | TEXT | Yes | Residential address |
| `city` | `city` | TEXT | Yes | City location |
| `state` | `state` | TEXT | Yes | State of residence |
| `pincode` | `pincode` | TEXT | Yes | Postal code |
| `emergencyContactName` | `emergencyContactName` | TEXT | Yes | Primary emergency caretaker contact |
| `emergencyContactPhone` | `emergencyContactPhone` | TEXT | Yes | Caretaker phone number |
| `medicalConditions` | `medicalConditions` | TEXT | Yes | Health conditions or mobility needs |
| `organizationName` | `organizationName` | TEXT | Yes | NGO Foundation name (for NGO leads) |
| `ngoRegistrationNo` | `ngoRegistrationNo` | TEXT | Yes | NGO DARPAN / Registration ID |
| `skills` | `skills` | JSONB | Yes | Array of volunteer qualifications |
| `availability` | `availability` | TEXT | Yes | Volunteer schedule availability |
| `rating` | `rating` | NUMERIC(3,2) | Yes | Volunteer service rating (1.0 to 5.0) |
| `completedTasksCount` | `completedTasksCount` | INTEGER | Yes | Total assistance tasks fulfilled |
| `createdAt` | `createdAt` | TIMESTAMPTZ | No | Registration timestamp |
| `updatedAt` | `updatedAt` | TIMESTAMPTZ | No | Last profile modification |

---

### Table: `public.requests`
Core operational records for senior assistance and emergency response.

| Field in API / JS Model | PostgreSQL Column | Data Type | Nullable | Description / Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `id` | TEXT | No | Primary key format: `SHY-YYYY-SEQ-XXXX` |
| `seniorId` | `seniorId` | TEXT | Yes | Beneficiary user reference |
| `seniorName` | `seniorName` | TEXT | No | Beneficiary name |
| `seniorAge` | `seniorAge` | INTEGER | Yes | Age of elder |
| `seniorPhone` | `seniorPhone` | TEXT | Yes | Contact phone |
| `seniorAddress` | `seniorAddress` | TEXT | Yes | Exact destination address |
| `city` | `city` | TEXT | Yes | City |
| `state` | `state` | TEXT | Yes | State |
| `type` | `type` | TEXT | No | `'medical'`, `'transport'`, `'grocery'`, `'documentation'`, `'emergency'` |
| `title` | `title` | TEXT | No | Short assistance summary |
| `description` | `description` | TEXT | No | Detailed requirement |
| `priority` | `priority` | TEXT | No | `'routine'`, `'urgent'`, `'emergency'` |
| `isEmergency` | `isEmergency` | BOOLEAN | No | High-priority SOS flag |
| `status` | `status` | TEXT | No | `'pending'`, `'assigned'`, `'in_progress'`, `'completed'`, `'cancelled'` |
| `landmark` | `landmark` | TEXT | Yes | Locality reference |
| `preferredTiming` | `preferredTiming` | TEXT | Yes | Preferred arrival time |
| `assignedVolunteerId` | `assignedVolunteerId` | TEXT | Yes | Assigned volunteer ID |
| `assignedVolunteerName`| `assignedVolunteerName`| TEXT | Yes | Assigned volunteer name |
| `assignedVolunteerPhone`| `assignedVolunteerPhone`| TEXT| Yes | Assigned volunteer phone |
| `assignedNgoId` | `assignedNgoId` | TEXT | Yes | Managing NGO coordinator ID |
| `assignedNgoName` | `assignedNgoName` | TEXT | Yes | Managing NGO foundation name |
| `assignedAt` | `assignedAt` | TIMESTAMPTZ | Yes | Assignment timestamp |
| `startedAt` | `startedAt` | TIMESTAMPTZ | Yes | In-progress start timestamp |
| `completedAt` | `completedAt` | TIMESTAMPTZ | Yes | Safe completion timestamp |
| `volunteerNotes` | `volunteerNotes` | JSONB | Yes | Array of `{ text, timestamp, authorName }` |
| `feedback` | `feedback` | JSONB | Yes | Object `{ rating, comment, submittedAt }` |
| `createdAt` | `createdAt` | TIMESTAMPTZ | No | Submission timestamp |
| `updatedAt` | `updatedAt` | TIMESTAMPTZ | No | Last update timestamp |

---

### Table: `public.schemes`
Central & State Government Welfare Directory records.

| Field in API / JS Model | PostgreSQL Column | Data Type | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `id` | TEXT | No | Primary key (`sch-001`, `sch-002`, etc.) |
| `name` | `name` | TEXT | No | Scheme title |
| `shortDescription` | `shortDescription` | TEXT | Yes | Summary subtitle |
| `fullDescription` | `fullDescription` | TEXT | Yes | Complete scheme overview |
| `governingBody` | `governingBody` | TEXT | Yes | Ministry / Department |
| `sourceType` | `sourceType` | TEXT | Yes | `'government'` or `'ngo'` |
| `benefitValue` | `benefitValue` | TEXT | Yes | e.g., `'₹5 Lakh Cashless/Yr'` |
| `helplinePhone` | `helplinePhone` | TEXT | Yes | Official toll-free phone |
| `category` | `category` | TEXT | No | `'healthcare'`, `'pension'`, `'assistive_devices'`, `'financial'`, etc. |
| `minAge` | `minAge` | INTEGER | Yes | Minimum qualifying age (default: 60) |
| `maxAge` | `maxAge` | INTEGER | Yes | Optional upper age limit |
| `gender` | `gender` | TEXT | Yes | `'all'`, `'female'`, `'male'` |
| `widowOnly` | `widowOnly` | BOOLEAN | Yes | Special widow pension flag |
| `incomeCriteria` | `incomeCriteria` | TEXT | Yes | `'any'`, `'bpl'`, `'low'`, `'middle'` |
| `maxAnnualIncome` | `maxAnnualIncome` | NUMERIC | Yes | Income threshold limit in INR |
| `applicableStates` | `applicableStates` | JSONB | Yes | Array e.g., `["All India"]` or `["Maharashtra"]` |
| `requiredDocuments` | `requiredDocuments` | JSONB | Yes | Array of required ID and income proofs |
| `benefits` | `benefits` | TEXT | No | Full entitlement details |
| `officialLink` | `officialLink` | TEXT | Yes | Official application portal URL |
| `applySteps` | `applySteps` | JSONB | Yes | Step-by-step guidance list |

---

## 2. Supabase Query Translation Examples

### Example 1: Create Assistance Request (`POST /api/requests`)
- **Old JSON write:**
  ```js
  db.getCollection('requests').unshift(newRequest);
  ```
- **Supabase query:**
  ```js
  const { data, error } = await supabase
    .from('requests')
    .insert(newRequest)
    .select()
    .single();
  ```

### Example 2: NGO Assigns Volunteer (`PATCH /api/requests/:id/assign`)
- **Old JSON write:**
  ```js
  db.updateById('requests', id, { assignedVolunteerId, status: 'assigned' });
  ```
- **Supabase query:**
  ```js
  const { data, error } = await supabase
    .from('requests')
    .update({
      assignedVolunteerId,
      assignedVolunteerName: volunteer.name,
      status: 'assigned',
      assignedAt: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  ```

### Example 3: Filter Active Emergency Requests (`GET /api/requests?isEmergency=true&status=pending`)
- **Old JSON filter:**
  ```js
  requests.filter(r => r.isEmergency && r.status === 'pending');
  ```
- **Supabase query:**
  ```js
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .eq('isEmergency', true)
    .eq('status', 'pending')
    .order('createdAt', { ascending: false });
  ```
