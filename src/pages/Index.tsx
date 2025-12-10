import { useState } from "react";
import Header from "@/components/Header";
import PersonCard from "@/components/PersonCard";
import BottomNav from "@/components/BottomNav";
import FloatingActions from "@/components/FloatingActions";
import { mockPeople } from "@/data/mockData";
import { Person } from "@/types/alarm";
import { toast } from "sonner";
const Index = () => {
  const [activeTab, setActiveTab] = useState("alarmes");
  const [people, setPeople] = useState<Person[]>(mockPeople);
  const handleAlarmToggle = (personId: string, alarmId: string) => {
    setPeople(prevPeople => prevPeople.map(person => {
      if (person.id === personId) {
        return {
          ...person,
          alarms: person.alarms.map(alarm => {
            if (alarm.id === alarmId) {
              const newState = !alarm.enabled;
              toast(newState ? "Alarme ativado" : "Alarme desativado", {
                description: `${alarm.medicationName} às ${alarm.time}`
              });
              return {
                ...alarm,
                enabled: newState
              };
            }
            return alarm;
          })
        };
      }
      return person;
    }));
  };
  const handleAddAlarm = () => {
    toast("Adicionar alarme", {
      description: "Funcionalidade em desenvolvimento"
    });
  };
  const handleAddMedication = () => {
    toast("Adicionar medicamento", {
      description: "Funcionalidade em desenvolvimento"
    });
  };
  return <div className="min-h-screen bg-background pb-24" style={{ backgroundColor: '#EEEEEE' }}>
      <Header />

      <main className="px-4 py-2 max-w-md mx-auto space-y-4 bg-[#f0f0f0]">
        {activeTab === "alarmes" && <>
            {people.map(person => <PersonCard key={person.id} person={person} onAlarmToggle={handleAlarmToggle} />)}
          </>}

        {activeTab === "registros" && <div className="bg-card rounded-xl p-6 shadow-card text-center">
            <p className="text-muted-foreground">
              Histórico de registros em breve
            </p>
          </div>}

        {activeTab === "estoque" && <div className="bg-card rounded-xl p-6 shadow-card text-center">
            <p className="text-muted-foreground">
              Gerenciamento de estoque em breve
            </p>
          </div>}

        {activeTab === "perfil" && <div className="bg-card rounded-xl p-6 shadow-card text-center">
            <p className="text-muted-foreground">Perfil do usuário em breve</p>
          </div>}
      </main>

      <FloatingActions onAddAlarm={handleAddAlarm} onAddMedication={handleAddMedication} />

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>;
};
export default Index;