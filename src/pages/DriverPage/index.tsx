import { DriverDataGrid } from "@/components/DriversDataGrid";
import { DriverRegistrationForm } from "@/components/FormRegisterDriver";

export default function DrivePage () {
  return (
    <div className="space-y-8">
      <div>
        <DriverRegistrationForm />
      </div>
      <div>
        <DriverDataGrid />
      </div>
    </div>
  )
}