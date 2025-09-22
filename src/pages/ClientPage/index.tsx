import { ClientDataGrid } from "@/components/ClientDataGrid";
import { FormClientRegister } from "@/components/FormClientRegister";

export default function ClientPage() {
  return (
    <div className="space-y-8">
      <div>
        <FormClientRegister />
      </div>
      <div>
        <ClientDataGrid />
      </div>
    </div>
  )
}