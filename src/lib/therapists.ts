export type Therapist = {
    id: string;
    name: string;
    specialization: string;
    contactNumber: string;
    email: string;
    address: string;
    city: string;
    state: string;
};

export const therapists: Therapist[] = [
  {
    id: "1",
    name: "Dr. Anjali Sharma",
    specialization: "Anxiety and Depression",
    contactNumber: "+91 98765 43210",
    email: "anjali.sharma@therapy.com",
    address: "123, Wellness Road, Bandra",
    city: "Mumbai",
    state: "Maharashtra",
  },
  {
    id: "2",
    name: "Dr. Vikram Singh",
    specialization: "Stress and Trauma",
    contactNumber: "+91 99887 76655",
    email: "vikram.singh@therapy.com",
    address: "456, Serenity Street, Koramangala",
    city: "Bengaluru",
    state: "Karnataka",
  },
  {
    id: "3",
    name: "Dr. Priya Desai",
    specialization: "Relationship Counseling",
    contactNumber: "+91 88776 65544",
    email: "priya.desai@therapy.com",
    address: "789, Harmony Lane, Hauz Khas",
    city: "New Delhi",
    state: "Delhi",
  },
  {
    id: "4",
    name: "Dr. Rohan Joshi",
    specialization: "Child and Adolescent Psychology",
    contactNumber: "+91 77665 54433",
    email: "rohan.joshi@therapy.com",
    address: "101, Joyful Avenue, Camp",
    city: "Pune",
    state: "Maharashtra",
  },
  {
    id: "5",
    name: "Dr. Meera Krishnan",
    specialization: "Cognitive Behavioral Therapy (CBT)",
    contactNumber: "+91 91234 56789",
    email: "meera.krishnan@therapy.com",
    address: "22, Mindful Way, T. Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
  },
  {
    id: "6",
    name: "Dr. Sameer Reddy",
    specialization: "Addiction and Substance Abuse",
    contactNumber: "+91 87654 32109",
    email: "sameer.reddy@therapy.com",
    address: "5, Recovery Path, Banjara Hills",
    city: "Hyderabad",
    state: "Telangana",
  },
   {
    id: "7",
    name: "Dr. Aisha Khan",
    specialization: "Workplace Stress",
    contactNumber: "+91 76543 21098",
    email: "aisha.khan@therapy.com",
    address: "8, Corporate Wellness Plaza, DLF Cyber City",
    city: "Gurugram",
    state: "Haryana",
  },
  {
    id: "8",
    name: "Dr. Arjun Mehta",
    specialization: "Mindfulness and Meditation",
    contactNumber: "+91 98765 12345",
    email: "arjun.mehta@therapy.com",
    address: "33, Zen Garden, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
  },
];
