import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data for appointments
const appointments = [
  {
    id: "APT-001",
    name: "Vikram Singh",
    carType: "SUV",
    phone: "9876543210",
    date: "2025-04-19",
    day: "Saturday",
    time: "11:00 AM",
    status: "Completed",
  },
  {
    id: "APT-002",
    name: "Meena Iyer",
    carType: "Sedan",
    phone: "9876543211",
    date: "2025-04-19",
    day: "Saturday",
    time: "2:00 PM",
    status: "Scheduled",
  },
  {
    id: "APT-003",
    name: "Suresh Kumar",
    carType: "Hatchback",
    phone: "9876543212",
    date: "2025-04-20",
    day: "Sunday",
    time: "10:00 AM",
    status: "Cancelled",
  },
  {
    id: "APT-004",
    name: "Ananya Patel",
    carType: "Luxury Car",
    phone: "9876543213",
    date: "2025-04-22",
    day: "Monday",
    time: "1:00 PM",
    status: "Scheduled",
  },
  {
    id: "APT-005",
    name: "Rahul Sharma",
    carType: "Sedan",
    phone: "9876543214",
    date: "2025-04-23",
    day: "Tuesday",
    time: "4:00 PM",
    status: "Scheduled",
  },
]

export default function CarWashAppointmentsPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Car Wash Appointments</h1>

      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of all car wash appointments.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Appointment ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Car Type</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">{appointment.id}</TableCell>
                <TableCell>{appointment.name}</TableCell>
                <TableCell>{appointment.carType}</TableCell>
                <TableCell>{appointment.phone}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.day}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      appointment.status === "Completed"
                        ? "default"
                        : appointment.status === "Scheduled"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
