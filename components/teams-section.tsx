"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, MapPin, Calendar } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface Team {
  idTeam: string
  strTeam: string
  strTeamBadge: string
  strBadge: string
  strStadiumLocation: string
  intFormedYear: string
  strLeague: string
  strStadium: string
  strEquipment: string
  strBanner: string
  strDescriptionEN: string
  strDescriptionES: string
  strFanart4: string
}

interface TeamsProps {
  onTeamSelect: (teamId: string, teamName: string) => void
}

export default function TeamsSection({ onTeamSelect }: TeamsProps) {
  const [teams, setTeams] = useState<{
    laLiga: Team[]
    premierLeague: Team[]
    serieA: Team[]
  }>({
    laLiga: [],
    premierLeague: [],
    serieA: [],
  })
  const [filteredTeams, setFilteredTeams] = useState<{
    laLiga: Team[]
    premierLeague: Team[]
    serieA: Team[]
  }>({
    laLiga: [],
    premierLeague: [],
    serieA: [],
  })
  const [loading, setLoading] = useState<{
    laLiga: boolean
    premierLeague: boolean
    serieA: boolean
  }>({
    laLiga: true,
    premierLeague: true,
    serieA: true,
  })
  const [error, setError] = useState<{
    laLiga: string | null
    premierLeague: string | null
    serieA: string | null
  }>({
    laLiga: null,
    premierLeague: null,
    serieA: null,
  })
  const [searchTerm, setSearchTerm] = useState("")

  const fetchTeams = async (league: string, key: "laLiga" | "premierLeague" | "serieA") => {
    try {
      setLoading((prev) => ({ ...prev, [key]: true }))
      setError((prev) => ({ ...prev, [key]: null }))

      console.log(`Fetching teams for ${league}`) // Añadir log para depuración

      const response = await fetch(
        `https://www.thesportsdb.com/api/v1/json/123/search_all_teams.php?l=${encodeURIComponent(league)}`,
      )

      if (!response.ok) {
        throw new Error(`Error al cargar equipos de ${league}`)
      }

      const data = await response.json()

      if (data.teams && data.teams.length > 0) {
        console.log(`Loaded ${data.teams.length} teams for ${league}`) // Añadir log para depuración
        setTeams((prev) => ({ ...prev, [key]: data.teams }))
        setFilteredTeams((prev) => ({ ...prev, [key]: data.teams }))
      } else {
        console.warn(`No teams found for ${league}`) // Añadir log para depuración
        throw new Error(`No se encontraron equipos para ${league}`)
      }
    } catch (err) {
      console.error(`Error fetching teams for ${league}:`, err) // Añadir log para depuración
      setError((prev) => ({ ...prev, [key]: err instanceof Error ? err.message : "Error desconocido" }))
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }))
    }
  }

  useEffect(() => {
    fetchTeams("Spanish La Liga", "laLiga")
    fetchTeams("English Premier League", "premierLeague")
    fetchTeams("Italian Serie A", "serieA")
    // Podríamos añadir más ligas aquí si fuera necesario
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      setFilteredTeams({
        laLiga: teams.laLiga.filter((team) => team.strTeam.toLowerCase().includes(term)),
        premierLeague: teams.premierLeague.filter((team) => team.strTeam.toLowerCase().includes(term)),
        serieA: teams.serieA.filter((team) => team.strTeam.toLowerCase().includes(term)),
      })
    } else {
      setFilteredTeams(teams)
    }
  }, [searchTerm, teams])

  const renderTeams = (leagueTeams: Team[], isLoading: boolean, errorMessage: string | null) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      )
    }

    if (errorMessage) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )
    }

    if (leagueTeams.length === 0) {
      return <p className="text-center py-8">No se encontraron equipos que coincidan con la búsqueda</p>
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {leagueTeams.map((team) => (
          <Card
            key={team.idTeam}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-green-100 dark:border-green-900 hover:border-green-300 dark:hover:border-green-700"
            onClick={() => onTeamSelect(team.idTeam, team.strTeam)}
          >
            <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
            <CardContent className="p-4 flex flex-col items-center">
              <Badge className="mb-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 hover:bg-green-100 dark:hover:bg-green-900">
                {team.strLeague}
              </Badge>
              <div className="h-32 w-32 flex items-center justify-center mb-4">
                <img
                  src={team.strTeamBadge || team.strBadge || "/placeholder.svg"}
                  alt={`${team.strTeam} logo`}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=128&width=128"
                  }}
                />
              </div>
              <h3 className="font-bold text-lg text-center">{team.strTeam}</h3>
            </CardContent>
            <CardFooter className="bg-muted/50 px-4 py-2 text-sm flex flex-col items-center gap-1">
              <p className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {team.strStadiumLocation || "N/A"} - {team.strStadium || "N/A"}
              </p>
              <p className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Fundado en {team.intFormedYear || "N/A"}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-300">Equipos</h2>
        <div className="w-full md:w-64">
          <Input
            placeholder="Buscar equipos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-green-200 dark:border-green-800 focus:border-green-500 dark:focus:border-green-500"
          />
        </div>
      </div>

      <Tabs defaultValue="laLiga" className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-green-50 dark:bg-green-900">
          <TabsTrigger value="laLiga" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
            La Liga
          </TabsTrigger>
          <TabsTrigger
            value="premierLeague"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
          >
            Premier League
          </TabsTrigger>
          <TabsTrigger value="serieA" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
            Serie A
          </TabsTrigger>
        </TabsList>

        <TabsContent value="laLiga" className="mt-6">
          {renderTeams(filteredTeams.laLiga, loading.laLiga, error.laLiga)}
        </TabsContent>

        <TabsContent value="premierLeague" className="mt-6">
          {renderTeams(filteredTeams.premierLeague, loading.premierLeague, error.premierLeague)}
        </TabsContent>

        <TabsContent value="serieA" className="mt-6">
          {renderTeams(filteredTeams.serieA, loading.serieA, error.serieA)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
