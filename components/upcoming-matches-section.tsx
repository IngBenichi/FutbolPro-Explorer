"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Calendar, Clock, MapPin } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface Match {
  idEvent: string
  dateEvent: string
  strTime: string
  strHomeTeam: string
  strAwayTeam: string
  strLeague: string
  strVenue: string
  strStatus: string
  strEvent: string
}

interface UpcomingMatchesSectionProps {
  onEventSelect: (eventId: string, eventName: string) => void
}

const LEAGUE_IDS = {
  laLiga: "4335",
  premierLeague: "4328",
  serieA: "4332",
}

export default function UpcomingMatchesSection({ onEventSelect }: UpcomingMatchesSectionProps) {
  const [matches, setMatches] = useState<{
    laLiga: Match[]
    premierLeague: Match[]
    serieA: Match[]
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

  const fetchMatches = async (leagueId: string, key: "laLiga" | "premierLeague" | "serieA") => {
    try {
      setLoading((prev) => ({ ...prev, [key]: true }))
      setError((prev) => ({ ...prev, [key]: null }))

      const response = await fetch(`https://www.thesportsdb.com/api/v1/json/123/eventsnextleague.php?id=${leagueId}`)

      if (!response.ok) {
        throw new Error(`Error al cargar próximos partidos de la liga ${key}`)
      }

      const data = await response.json()

      if (data.events) {
        setMatches((prev) => ({ ...prev, [key]: data.events }))
      } else {
        throw new Error(`No se encontraron próximos partidos para la liga ${key}`)
      }
    } catch (err) {
      setError((prev) => ({ ...prev, [key]: err instanceof Error ? err.message : "Error desconocido" }))
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }))
    }
  }

  useEffect(() => {
    fetchMatches(LEAGUE_IDS.laLiga, "laLiga")
    fetchMatches(LEAGUE_IDS.premierLeague, "premierLeague")
    fetchMatches(LEAGUE_IDS.serieA, "serieA")
  }, [])

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"

    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A"
    return timeString.substring(0, 5)
  }

  const renderMatches = (leagueMatches: Match[], isLoading: boolean, errorMessage: string | null) => {
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

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {leagueMatches.slice(0, 10).map((match) => (
          <Card
            key={match.idEvent}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-green-100 dark:border-green-900 hover:border-green-300 dark:hover:border-green-700"
            onClick={() =>
              onEventSelect(match.idEvent, match.strEvent || `${match.strHomeTeam} vs ${match.strAwayTeam}`)
            }
          >
            <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(match.dateEvent)}</span>
                    <Clock className="h-3 w-3 ml-2" />
                    <span>{formatTime(match.strTime)}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Próximo
                  </Badge>
                </div>

                <div className="flex justify-between items-center my-2">
                  <div className="flex-1">
                    <p className="font-medium text-lg">{match.strHomeTeam}</p>
                  </div>

                  <div className="flex items-center justify-center px-4">
                    <span className="text-2xl font-bold">vs</span>
                  </div>

                  <div className="flex-1 text-right">
                    <p className="font-medium text-lg">{match.strAwayTeam}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <MapPin className="h-3 w-3" />
                  <span>{match.strVenue || "Estadio no disponible"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {leagueMatches.length === 0 && (
          <div className="col-span-full text-center py-8">No se encontraron próximos partidos</div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-800 dark:text-green-300">Próximos Partidos</h2>

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
          {renderMatches(matches.laLiga, loading.laLiga, error.laLiga)}
        </TabsContent>

        <TabsContent value="premierLeague" className="mt-6">
          {renderMatches(matches.premierLeague, loading.premierLeague, error.premierLeague)}
        </TabsContent>

        <TabsContent value="serieA" className="mt-6">
          {renderMatches(matches.serieA, loading.serieA, error.serieA)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
