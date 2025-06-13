"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Calendar, Clock, MapPin, ArrowLeft, Users, Timer, Tv } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EventDetails {
  idEvent: string
  strEvent: string
  strLeague: string
  strSeason: string
  strHomeTeam: string
  strAwayTeam: string
  intHomeScore: string
  intAwayScore: string
  strStatus: string
  dateEvent: string
  strTime: string
  strVenue: string
  strThumb: string
  strBanner: string
  strVideo: string
  strPostponed: string
  strTimestamp: string
}

interface EventLineup {
  idPlayer: string
  idTeam: string
  strPlayer: string
  strTeam: string
  strPosition: string
  strHome: string
  strSubstitute: string
  strCutout: string
}

interface EventTimeline {
  idEvent: string
  idPlayer: string
  strTimeline: string
  strTimelineDetail: string
  strPlayer: string
  strTeam: string
  strTime: string
  strTimelineType: string
}

interface EventStats {
  idEvent: string
  idHome: string
  idAway: string
  strEvent: string
  strHomeTeam: string
  strAwayTeam: string
  intHomeScore: string
  intAwayScore: string
  intHomeShots: string
  intAwayShots: string
  intHomeShotsOnGoal: string
  intAwayShotsOnGoal: string
  intHomeCorners: string
  intAwayCorners: string
  intHomeFouls: string
  intAwayFouls: string
  intHomeYellowCards: string
  intAwayYellowCards: string
  intHomeRedCards: string
  intAwayRedCards: string
  intHomeLineupGoalkeeper: string
  intAwayLineupGoalkeeper: string
  intHomeLineupDefense: string
  intAwayLineupDefense: string
  intHomeLineupMidfield: string
  intAwayLineupMidfield: string
  intHomeLineupForward: string
  intAwayLineupForward: string
  intHomeLineupSubstitutes: string
  intAwayLineupSubstitutes: string
  intHomeFormation: string
  intAwayFormation: string
  strHomeFormation: string
  strAwayFormation: string
  strHomeGoalDetails: string
  strAwayGoalDetails: string
  strHomeRedCards: string
  strAwayRedCards: string
  strHomeYellowCards: string
  strAwayYellowCards: string
  strHomeLineupGoalkeeper: string
  strAwayLineupGoalkeeper: string
  strHomeLineupDefense: string
  strAwayLineupDefense: string
  strHomeLineupMidfield: string
  strAwayLineupMidfield: string
  strHomeLineupForward: string
  strAwayLineupForward: string
  strHomeLineupSubstitutes: string
  strAwayLineupSubstitutes: string
  strHomeDescription: string
  strAwayDescription: string
}

interface EventTV {
  idEvent: string
  idChannel: string
  strChannel: string
  strLogo: string
  strCountry: string
  strLang: string
}

interface EventDetailsSectionProps {
  eventId: string
  onBack: () => void
}

export default function EventDetailsSection({ eventId, onBack }: EventDetailsSectionProps) {
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null)
  const [eventLineup, setEventLineup] = useState<EventLineup[]>([])
  const [eventTimeline, setEventTimeline] = useState<EventTimeline[]>([])
  const [eventStats, setEventStats] = useState<EventStats | null>(null)
  const [eventTV, setEventTV] = useState<EventTV[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch event details
        const detailsResponse = await fetch(`https://www.thesportsdb.com/api/v1/json/123/lookupevent.php?id=${eventId}`)

        if (!detailsResponse.ok) {
          throw new Error("Error al cargar detalles del evento")
        }

        const detailsData = await detailsResponse.json()

        if (detailsData.events && detailsData.events.length > 0) {
          setEventDetails(detailsData.events[0])

          // Fetch event lineup
          try {
            const lineupResponse = await fetch(
              `https://www.thesportsdb.com/api/v1/json/123/lookuplineup.php?id=${eventId}`,
            )
            if (lineupResponse.ok) {
              const lineupData = await lineupResponse.json()
              if (lineupData.lineup) {
                setEventLineup(lineupData.lineup)
              }
            }
          } catch (err) {
            console.error("Error fetching lineup:", err)
          }

          // Fetch event timeline
          try {
            const timelineResponse = await fetch(
              `https://www.thesportsdb.com/api/v1/json/123/lookuptimeline.php?id=${eventId}`,
            )
            if (timelineResponse.ok) {
              const timelineData = await timelineResponse.json()
              if (timelineData.timeline) {
                setEventTimeline(timelineData.timeline)
              }
            }
          } catch (err) {
            console.error("Error fetching timeline:", err)
          }

          // Fetch event stats
          try {
            const statsResponse = await fetch(
              `https://www.thesportsdb.com/api/v1/json/123/lookupeventstats.php?id=${eventId}`,
            )
            if (statsResponse.ok) {
              const statsData = await statsResponse.json()
              if (statsData.eventstats && statsData.eventstats.length > 0) {
                setEventStats(statsData.eventstats[0])
              }
            }
          } catch (err) {
            console.error("Error fetching stats:", err)
          }

          // Fetch event TV
          try {
            const tvResponse = await fetch(`https://www.thesportsdb.com/api/v1/json/123/lookuptv.php?id=${eventId}`)
            if (tvResponse.ok) {
              const tvData = await tvResponse.json()
              if (tvData.tv) {
                setEventTV(tvData.tv)
              }
            }
          } catch (err) {
            console.error("Error fetching TV:", err)
          }
        } else {
          throw new Error("No se encontraron detalles para este evento")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchEventDetails()
    }
  }, [eventId])

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

  const getTimelineIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "goal":
        return "⚽"
      case "yellowcard":
        return "🟨"
      case "redcard":
        return "🟥"
      case "substitution":
        return "🔄"
      case "penalty":
        return "🎯"
      default:
        return "⏱️"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (error || !eventDetails) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertDescription>{error || "No se pudieron cargar los detalles del evento"}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" className="mb-4" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
      </Button>

      <div
        className="h-48 md:h-64 rounded-lg bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: `url(${eventDetails.strBanner || eventDetails.strThumb || "/placeholder.svg?height=240&width=1200"})`,
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6 w-full">
            <div className="flex flex-col items-center justify-center">
              <Badge
                className={`mb-2 ${eventDetails.strStatus === "Match Finished" ? "bg-green-500" : "bg-yellow-500"}`}
              >
                {eventDetails.strStatus || "Finalizado"}
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold text-white text-center">{eventDetails.strEvent}</h1>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-green-200">
                  {eventDetails.strLeague} - {eventDetails.strSeason}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex-1 text-center md:text-right mb-4 md:mb-0">
          <h2 className="text-xl md:text-2xl font-bold">{eventDetails.strHomeTeam}</h2>
          <p className="text-sm text-muted-foreground">Local</p>
        </div>

        <div className="mx-8 flex flex-col items-center">
          <div className="text-3xl md:text-4xl font-bold">
            {eventDetails.intHomeScore || "0"} - {eventDetails.intAwayScore || "0"}
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(eventDetails.dateEvent)}</span>
            <Clock className="h-4 w-4 ml-2" />
            <span>{formatTime(eventDetails.strTime)}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{eventDetails.strVenue || "Estadio no disponible"}</span>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold">{eventDetails.strAwayTeam}</h2>
          <p className="text-sm text-muted-foreground">Visitante</p>
        </div>
      </div>

      {eventDetails.strVideo && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Highlights</h3>
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${eventDetails.strVideo.split("v=")[1]}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="w-full grid grid-cols-4 bg-green-50 dark:bg-green-900">
          <TabsTrigger value="stats" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
            Estadísticas
          </TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
            Timeline
          </TabsTrigger>
          <TabsTrigger value="lineup" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
            Alineaciones
          </TabsTrigger>
          <TabsTrigger value="tv" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
            TV
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="mt-6">
          <Card>
            <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
            <CardHeader>
              <CardTitle>Estadísticas del Partido</CardTitle>
            </CardHeader>
            <CardContent>
              {eventStats ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-right font-medium">{eventStats.intHomeShotsOnGoal || "0"}</div>
                    <div className="text-center text-sm text-muted-foreground">Tiros a puerta</div>
                    <div className="text-left font-medium">{eventStats.intAwayShotsOnGoal || "0"}</div>

                    <div className="text-right font-medium">{eventStats.intHomeShots || "0"}</div>
                    <div className="text-center text-sm text-muted-foreground">Tiros totales</div>
                    <div className="text-left font-medium">{eventStats.intAwayShots || "0"}</div>

                    <div className="text-right font-medium">{eventStats.intHomeCorners || "0"}</div>
                    <div className="text-center text-sm text-muted-foreground">Córners</div>
                    <div className="text-left font-medium">{eventStats.intAwayCorners || "0"}</div>

                    <div className="text-right font-medium">{eventStats.intHomeFouls || "0"}</div>
                    <div className="text-center text-sm text-muted-foreground">Faltas</div>
                    <div className="text-left font-medium">{eventStats.intAwayFouls || "0"}</div>

                    <div className="text-right font-medium">{eventStats.intHomeYellowCards || "0"}</div>
                    <div className="text-center text-sm text-muted-foreground">Tarjetas amarillas</div>
                    <div className="text-left font-medium">{eventStats.intAwayYellowCards || "0"}</div>

                    <div className="text-right font-medium">{eventStats.intHomeRedCards || "0"}</div>
                    <div className="text-center text-sm text-muted-foreground">Tarjetas rojas</div>
                    <div className="text-left font-medium">{eventStats.intAwayRedCards || "0"}</div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Tiros a puerta</span>
                        <span>
                          {eventStats.intHomeShotsOnGoal || "0"} - {eventStats.intAwayShotsOnGoal || "0"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{
                              width: `${(Number.parseInt(eventStats.intHomeShotsOnGoal || "0") / (Number.parseInt(eventStats.intHomeShotsOnGoal || "0") + Number.parseInt(eventStats.intAwayShotsOnGoal || "0"))) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Tiros totales</span>
                        <span>
                          {eventStats.intHomeShots || "0"} - {eventStats.intAwayShots || "0"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{
                              width: `${(Number.parseInt(eventStats.intHomeShots || "0") / (Number.parseInt(eventStats.intHomeShots || "0") + Number.parseInt(eventStats.intAwayShots || "0"))) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Córners</span>
                        <span>
                          {eventStats.intHomeCorners || "0"} - {eventStats.intAwayCorners || "0"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{
                              width: `${(Number.parseInt(eventStats.intHomeCorners || "0") / (Number.parseInt(eventStats.intHomeCorners || "0") + Number.parseInt(eventStats.intAwayCorners || "0"))) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Faltas</span>
                        <span>
                          {eventStats.intHomeFouls || "0"} - {eventStats.intAwayFouls || "0"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{
                              width: `${(Number.parseInt(eventStats.intHomeFouls || "0") / (Number.parseInt(eventStats.intHomeFouls || "0") + Number.parseInt(eventStats.intAwayFouls || "0"))) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Formación {eventDetails.strHomeTeam}</h4>
                      <p className="text-2xl font-bold text-center">{eventStats.strHomeFormation || "N/A"}</p>
                      <div className="mt-4">
                        <div className="mb-2">
                          <span className="font-medium">Portero:</span> {eventStats.strHomeLineupGoalkeeper || "N/A"}
                        </div>
                        <div className="mb-2">
                          <span className="font-medium">Defensa:</span> {eventStats.strHomeLineupDefense || "N/A"}
                        </div>
                        <div className="mb-2">
                          <span className="font-medium">Mediocampo:</span> {eventStats.strHomeLineupMidfield || "N/A"}
                        </div>
                        <div className="mb-2">
                          <span className="font-medium">Delantera:</span> {eventStats.strHomeLineupForward || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Suplentes:</span> {eventStats.strHomeLineupSubstitutes || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Formación {eventDetails.strAwayTeam}</h4>
                      <p className="text-2xl font-bold text-center">{eventStats.strAwayFormation || "N/A"}</p>
                      <div className="mt-4">
                        <div className="mb-2">
                          <span className="font-medium">Portero:</span> {eventStats.strAwayLineupGoalkeeper || "N/A"}
                        </div>
                        <div className="mb-2">
                          <span className="font-medium">Defensa:</span> {eventStats.strAwayLineupDefense || "N/A"}
                        </div>
                        <div className="mb-2">
                          <span className="font-medium">Mediocampo:</span> {eventStats.strAwayLineupMidfield || "N/A"}
                        </div>
                        <div className="mb-2">
                          <span className="font-medium">Delantera:</span> {eventStats.strAwayLineupForward || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Suplentes:</span> {eventStats.strAwayLineupSubstitutes || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No hay estadísticas disponibles para este partido
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-green-500" />
                Timeline del Partido
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventTimeline.length > 0 ? (
                <div className="relative border-l border-gray-200 dark:border-gray-700 ml-6">
                  {eventTimeline.map((event, index) => (
                    <div key={index} className="mb-10 ml-6">
                      <div className="absolute w-6 h-6 bg-green-100 rounded-full -left-3 border border-green-500 dark:border-green-400 dark:bg-green-900 flex items-center justify-center">
                        <span>{getTimelineIcon(event.strTimelineType)}</span>
                      </div>
                      <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                        {event.strTime}'
                      </time>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        {event.strTimelineType}
                        <Badge variant="outline">{event.strTeam}</Badge>
                      </h3>
                      <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                        {event.strPlayer && <span className="font-medium">{event.strPlayer}: </span>}
                        {event.strTimelineDetail}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">No hay timeline disponible para este partido</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lineup" className="mt-6">
          <Card>
            <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                Alineaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventLineup.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-lg mb-4">{eventDetails.strHomeTeam}</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Titulares</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {eventLineup
                            .filter((player) => player.strHome === "1" && player.strSubstitute === "0")
                            .map((player, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                  <img
                                    src={player.strCutout || "/placeholder.svg?height=32&width=32"}
                                    alt={player.strPlayer}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=32&width=32"
                                    }}
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{player.strPlayer}</p>
                                  <p className="text-xs text-muted-foreground">{player.strPosition}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Suplentes</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {eventLineup
                            .filter((player) => player.strHome === "1" && player.strSubstitute === "1")
                            .map((player, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                  <img
                                    src={player.strCutout || "/placeholder.svg?height=32&width=32"}
                                    alt={player.strPlayer}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=32&width=32"
                                    }}
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{player.strPlayer}</p>
                                  <p className="text-xs text-muted-foreground">{player.strPosition}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-4">{eventDetails.strAwayTeam}</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Titulares</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {eventLineup
                            .filter((player) => player.strHome === "0" && player.strSubstitute === "0")
                            .map((player, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                  <img
                                    src={player.strCutout || "/placeholder.svg?height=32&width=32"}
                                    alt={player.strPlayer}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=32&width=32"
                                    }}
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{player.strPlayer}</p>
                                  <p className="text-xs text-muted-foreground">{player.strPosition}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Suplentes</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {eventLineup
                            .filter((player) => player.strHome === "0" && player.strSubstitute === "1")
                            .map((player, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                  <img
                                    src={player.strCutout || "/placeholder.svg?height=32&width=32"}
                                    alt={player.strPlayer}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=32&width=32"
                                    }}
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{player.strPlayer}</p>
                                  <p className="text-xs text-muted-foreground">{player.strPosition}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No hay alineaciones disponibles para este partido
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tv" className="mt-6">
          <Card>
            <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tv className="h-5 w-5 text-green-500" />
                Transmisión TV
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventTV.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {eventTV.map((tv, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
                      <CardContent className="p-4 flex flex-col items-center">
                        <div className="h-16 w-full flex items-center justify-center mb-4">
                          <img
                            src={tv.strLogo || "/placeholder.svg?height=64&width=128"}
                            alt={tv.strChannel}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=64&width=128"
                            }}
                          />
                        </div>
                        <h3 className="font-bold text-center">{tv.strChannel}</h3>
                        <Badge className="mt-2">{tv.strCountry}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{tv.strLang}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No hay información de TV disponible para este partido
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
