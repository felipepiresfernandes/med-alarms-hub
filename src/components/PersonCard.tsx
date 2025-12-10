import { useState } from "react";
import { Person } from "@/types/alarm";
import AlarmCard from "./AlarmCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonCardProps {
  person: Person;
  onAlarmToggle: (personId: string, alarmId: string) => void;
}

const ALARMS_PER_PAGE = 3;

const PersonCard = ({ person, onAlarmToggle }: PersonCardProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(person.alarms.length / ALARMS_PER_PAGE);
  
  const startIndex = currentPage * ALARMS_PER_PAGE;
  const visibleAlarms = person.alarms.slice(startIndex, startIndex + ALARMS_PER_PAGE);

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <div className="bg-card rounded-xl p-4 shadow-card animate-fade-in" style={{ border: '1px solid #E0E0E0' }}>
      {/* Person Header */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={person.avatar}
          alt={person.name}
          className="rounded-full object-cover"
          style={{ width: '28px', height: '28px' }}
        />
        <h2 className="font-semibold text-foreground">{person.name}</h2>
      </div>

      {/* Alarms List */}
      <div className="space-y-2 mb-4">
        {visibleAlarms.map((alarm) => (
          <AlarmCard
            key={alarm.id}
            alarm={alarm}
            onToggle={(alarmId) => onAlarmToggle(person.id, alarmId)}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={goToPrevious}
            disabled={currentPage === 0}
            className={cn(
              "p-2 rounded-lg border border-border transition-colors",
              currentPage === 0
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-muted active:bg-muted/80"
            )}
          >
            <ChevronLeft className="w-4 h-4 text-primary" />
          </button>

          {/* Page Indicators */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === currentPage
                    ? "w-6 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            disabled={currentPage === totalPages - 1}
            className={cn(
              "p-2 rounded-lg border border-border transition-colors",
              currentPage === totalPages - 1
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-muted active:bg-muted/80"
            )}
          >
            <ChevronRight className="w-4 h-4 text-primary" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonCard;
