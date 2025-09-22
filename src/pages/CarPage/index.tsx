import { CarDataGrid } from "@/components/CarDataGrid";
import { CarRegisterForm } from "@/components/FormCarRegister";

export default function CarPage() {
  return (
    <div className="space-y-8">
      <div>
        <CarRegisterForm />
      </div>
      <div>
        <CarDataGrid />
      </div>
    </div>
  )
}