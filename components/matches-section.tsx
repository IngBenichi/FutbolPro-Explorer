"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Calendar, Clock, MapPin } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Match {
  idEvent: string
  dateEvent: string
  strTime: string
  strHomeTeam: string
  strAwayTeam: string
  intHomeScore: string
  intAwayScore: string
  strLeague: string
  strVenue: string
  strStatus: string
  strHomeGoalDetails: string
  strAwayGoalDetails: string
  strHomeRedCards: string
  strAwayRedCards: string
  strHomeYellowCards: string
  strAwayYellowCards: string
  strEvent: string
}

interface MatchesSectionProps {
  onEventSelect: (eventId: string, eventName: string) => void
}

const LEAGUE_IDS = {
  laLiga: "4335",
  premierLeague: "4328",
  serieA: "4332",
}

export default function MatchesSection({ onEventSelect }: MatchesSectionProps) {
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
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  const fetchMatches = async (leagueId: string, key: "laLiga" | "premierLeague" | "serieA") => {
    try {
      setLoading((prev) => ({ ...prev, [key]: true }))
      setError((prev) => ({ ...prev, [key]: null }))

      const response = await fetch(`https://www.thesportsdb.com/api/v1/json/123/eventspastleague.php?id=${leagueId}`)

      if (!response.ok) {
        throw new Error(`Error al cargar partidos de la liga ${key}`)
      }

      const data = await response.json()

      if (data.events) {
        setMatches((prev) => ({ ...prev, [key]: data.events }))
      } else {
        throw new Error(`No se encontraron partidos para la liga ${key}`)
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

  const parseGoals = (goalDetails: string) => {
    if (!goalDetails) return []
    return goalDetails
      .split(";")
      .filter(Boolean)
      .map((goal) => {
        const [time, scorer] = goal.split(":")
        return { time: time?.trim(), scorer: scorer?.trim() }
      })
  }

  const parseCards = (cardDetails: string) => {
    if (!cardDetails) return []
    return cardDetails.split(";").filter(Boolean)
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
                  <Badge variant={match.strStatus === "Match Finished" ? "outline" : "secondary"} className="text-xs">
                    {match.strStatus || "Finalizado"}
                  </Badge>
                </div>

                <div className="flex justify-between items-center my-2">
                  <div className="flex-1">
                    <p className="font-medium text-lg">{match.strHomeTeam}</p>
                  </div>

                  <div className="flex items-center justify-center px-4">
                    <span className="text-2xl font-bold">
                      {match.intHomeScore} - {match.intAwayScore}
                    </span>
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
          <div className="col-span-full text-center py-8">No se encontraron partidos recientes</div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-800 dark:text-green-300">Partidos Recientes</h2>

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

      <Dialog open={!!selectedMatch} onOpenChange={(open) => !open && setSelectedMatch(null)}>
        <DialogContent className="max-w-3xl">
          {selectedMatch && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">Detalles del Partido</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(selectedMatch.dateEvent)}</span>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{formatTime(selectedMatch.strTime)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedMatch.strVenue || "Estadio no disponible"}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center my-4">
                  <div className="flex-1 text-center md:text-right">
                    <p className="font-bold text-xl">{selectedMatch.strHomeTeam}</p>
                  </div>

                  <div className="flex items-center justify-center px-6">
                    <span className="text-3xl font-bold">
                      {selectedMatch.intHomeScore} - {selectedMatch.intAwayScore}
                    </span>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <p className="font-bold text-xl">{selectedMatch.strAwayTeam}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2 text-green-700 dark:text-green-300">
                      Goles {selectedMatch.strHomeTeam}
                    </h3>
                    <ul className="space-y-1">
                      {parseGoals(selectedMatch.strHomeGoalDetails).map((goal, index) => (
                        <li key={index} className="text-sm">
                          {goal.time}' - {goal.scorer}
                        </li>
                      ))}
                      {!selectedMatch.strHomeGoalDetails && (
                        <li className="text-sm text-muted-foreground">Sin goles</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2 text-green-700 dark:text-green-300">
                      Goles {selectedMatch.strAwayTeam}
                    </h3>
                    <ul className="space-y-1">
                      {parseGoals(selectedMatch.strAwayGoalDetails).map((goal, index) => (
                        <li key={index} className="text-sm">
                          {goal.time}' - {goal.scorer}
                        </li>
                      ))}
                      {!selectedMatch.strAwayGoalDetails && (
                        <li className="text-sm text-muted-foreground">Sin goles</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2 text-yellow-600">Tarjetas {selectedMatch.strHomeTeam}</h3>
                    <div className="space-y-1">
                      <div>
                        <span className="font-medium text-sm">Amarillas:</span>
                        <ul className="list-disc list-inside">
                          {parseCards(selectedMatch.strHomeYellowCards).map((card, index) => (
                            <li key={index} className="text-sm">
                              {card}
                            </li>
                          ))}
                          {!selectedMatch.strHomeYellowCards && (
                            <li className="text-sm text-muted-foreground">Ninguna</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium text-sm text-red-600">Rojas:</span>
                        <ul className="list-disc list-inside">
                          {parseCards(selectedMatch.strHomeRedCards).map((card, index) => (
                            <li key={index} className="text-sm">
                              {card}
                            </li>
                          ))}
                          {!selectedMatch.strHomeRedCards && <li className="text-sm text-muted-foreground">Ninguna</li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2 text-yellow-600">Tarjetas {selectedMatch.strAwayTeam}</h3>
                    <div className="space-y-1">
                      <div>
                        <span className="font-medium text-sm">Amarillas:</span>
                        <ul className="list-disc list-inside">
                          {parseCards(selectedMatch.strAwayYellowCards).map((card, index) => (
                            <li key={index} className="text-sm">
                              {card}
                            </li>
                          ))}
                          {!selectedMatch.strAwayYellowCards && (
                            <li className="text-sm text-muted-foreground">Ninguna</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium text-sm text-red-600">Rojas:</span>
                        <ul className="list-disc list-inside">
                          {parseCards(selectedMatch.strAwayRedCards).map((card, index) => (
                            <li key={index} className="text-sm">
                              {card}
                            </li>
                          ))}
                          {!selectedMatch.strAwayRedCards && <li className="text-sm text-muted-foreground">Ninguna</li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setSelectedMatch(null)
                      onEventSelect(
                        selectedMatch.idEvent,
                        selectedMatch.strEvent || `${selectedMatch.strHomeTeam} vs ${selectedMatch.strAwayTeam}`,
                      )
                    }}
                  >
                    Ver detalles completos
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedMatch(null)} className="ml-2">
                    Cerrar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
