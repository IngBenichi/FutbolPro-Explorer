"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import TeamsSection from "@/components/teams-section"
import PlayersSection from "@/components/players-section"
import MatchesSection from "@/components/matches-section"
import LeagueTableSection from "@/components/league-table-section"
import UpcomingMatchesSection from "@/components/upcoming-matches-section"
import SearchSection from "@/components/search-section"
import EventDetailsSection from "@/components/event-details-section"
import { Search, Calendar, Table2, Users, Shield } from "lucide-react"

export default function Home() {
  const [selectedTeam, setSelectedTeam] = useState<{ id: string; name: string } | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<{ id: string; name: string } | null>(null)
  const [activeTab, setActiveTab] = useState("teams")

  // Modificada para ir directamente a la vista de jugadores
  const handleTeamSelect = (teamId: string, teamName: string) => {
    console.log("Team selected:", teamId, teamName)
    setSelectedTeam({ id: teamId, name: teamName })
    setActiveTab("players") // Cambiado de "teamDetails" a "players"
  }

  const handlePlayerTeamSelect = (teamId: string, teamName: string) => {
    console.log("Player team selected:", teamId, teamName)
    setSelectedTeam({ id: teamId, name: teamName })
    setActiveTab("players")
  }

  const handleEventSelect = (eventId: string, eventName: string) => {
    console.log("Event selected:", eventId, eventName)
    setSelectedEvent({ id: eventId, name: eventName })
    setActiveTab("eventDetails")
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <header className="py-6 md:py-8 flex flex-col sm:flex-row justify-between items-center border-b border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <div className="bg-green-600 text-white p-2 rounded-full">
                <Shield className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                FútbolPro Explorer
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <SearchTrigger setActiveTab={setActiveTab} />
              <ThemeToggle />
            </div>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
            <div className="overflow-x-auto pb-2">
              <TabsList className="h-auto p-1 grid grid-cols-5 md:w-fit w-[500px]">
                <TabsTrigger value="teams" className="flex items-center gap-2 py-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden md:inline">Equipos</span>
                </TabsTrigger>
                <TabsTrigger value="players" disabled={!selectedTeam} className="flex items-center gap-2 py-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden md:inline">Jugadores</span>
                </TabsTrigger>
                <TabsTrigger value="matches" className="flex items-center gap-2 py-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden md:inline">Partidos</span>
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="flex items-center gap-2 py-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden md:inline">Próximos</span>
                </TabsTrigger>
                <TabsTrigger value="table" className="flex items-center gap-2 py-2">
                  <Table2 className="h-4 w-4" />
                  <span className="hidden md:inline">Clasificación</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="teams" className="mt-6">
              <TeamsSection onTeamSelect={handleTeamSelect} />
            </TabsContent>

            <TabsContent value="players" className="mt-6">
              {selectedTeam ? (
                <PlayersSection
                  key={`players-${selectedTeam.id}`}
                  teamId={selectedTeam.id}
                  teamName={selectedTeam.name}
                />
              ) : (
                <div className="text-center py-8">Selecciona un equipo para ver sus jugadores</div>
              )}
            </TabsContent>

            <TabsContent value="matches" className="mt-6">
              <MatchesSection onEventSelect={handleEventSelect} />
            </TabsContent>

            <TabsContent value="upcoming" className="mt-6">
              <UpcomingMatchesSection onEventSelect={handleEventSelect} />
            </TabsContent>

            <TabsContent value="table" className="mt-6">
              <LeagueTableSection />
            </TabsContent>

            <TabsContent value="search" className="mt-6">
              <SearchSection onTeamSelect={handleTeamSelect} onPlayerTeamSelect={handlePlayerTeamSelect} />
            </TabsContent>

            <TabsContent value="eventDetails" className="mt-6">
              {selectedEvent ? (
                <EventDetailsSection
                  key={`event-${selectedEvent.id}`}
                  eventId={selectedEvent.id}
                  onBack={() => setActiveTab("matches")}
                />
              ) : (
                <div className="text-center py-8">Selecciona un partido para ver sus detalles</div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <footer className="mt-16 bg-green-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  FútbolPro Explorer
                </h3>
                <p className="text-green-100">
                  Tu portal definitivo para explorar equipos, jugadores y partidos de las mejores ligas de fútbol del
                  mundo.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Ligas Disponibles</h4>
                <ul className="space-y-1 text-green-100">
                  <li>La Liga Española</li>
                  <li>Premier League Inglesa</li>
                  <li>Serie A Italiana</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">Datos Proporcionados Por</h4>
                <p className="text-green-100">TheSportsDB API</p>
                <p className="text-xs text-green-200 mt-4">
                  © {new Date().getFullYear()} FútbolPro Explorer. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </ThemeProvider>
  )
}

function SearchTrigger({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  return (
    <button
      onClick={() => setActiveTab("search")}
      className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <Search className="h-4 w-4" />
      <span className="hidden sm:inline">Buscar</span>
    </button>
  )
}
