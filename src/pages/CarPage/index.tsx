import { CarCards } from "@/components/CarCardList";
import { CarRegisterForm } from "@/components/FormCarRegister";

export default function CarPage() {
  return (
    <div className="space-y-8">
      <div>
        <CarRegisterForm />
      </div>
      <div>
        <CarCards />
      </div>
    </div>
  )
}