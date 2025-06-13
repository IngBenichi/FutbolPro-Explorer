"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, MapPin, Globe, Calendar, Users } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TeamDetails {
  idTeam: string
  strTeam: string
  strTeamBadge: string
  strTeamJersey: string
  strTeamLogo: string
  strTeamBanner: string
  strStadium: string
  strStadiumThumb: string
  strStadiumDescription: string
  strStadiumLocation: string
  intStadiumCapacity: string
  strWebsite: string
  strFacebook: string
  strTwitter: string
  strInstagram: string
  strYoutube: string
  strDescriptionEN: string
  strDescriptionES: string
  strCountry: string
  strLeague: string
  intFormedYear: string
  strTeamShort: string
  strBanner: string
  strBadge: string
  strEquipment: string
  strFanart4: string
}

interface TeamDetailsProps {
  teamId: string
  onPlayerView: (teamId: string, teamName: string) => void
}

export default function TeamDetailsSection({ teamId, onPlayerView }: TeamDetailsProps) {
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("Fetching details for team ID:", teamId) // Añadir log para depuración

        const response = await fetch(`https://www.thesportsdb.com/api/v1/json/123/lookupteam.php?id=${teamId}`)

        if (!response.ok) {
          throw new Error(`Error al cargar detalles del equipo`)
        }

        const data = await response.json()

        if (data.teams && data.teams.length > 0) {
          console.log("Team details loaded:", data.teams[0].strTeam) // Añadir log para depuración
          setTeamDetails(data.teams[0])
        } else {
          throw new Error(`No se encontraron detalles para este equipo`)
        }
      } catch (err) {
        console.error("Error fetching team details:", err) // Añadir log para depuración
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    // Asegurarnos de que teamId existe antes de hacer la petición
    if (teamId) {
      fetchTeamDetails()
    }
  }, [teamId])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (error || !teamDetails) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertDescription>{error || "No se pudieron cargar los detalles del equipo"}</AlertDescription>
      </Alert>
    )
  }

  const formatSocialLink = (url: string) => {
    if (!url) return ""
    if (url.startsWith("http")) return url
    return `https://${url}`
  }

  return (
    <div className="space-y-8">
      <div
        className="h-48 md:h-64 rounded-lg bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: `url(${teamDetails.strBanner || "/placeholder.svg?height=240&width=1200"})`,
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6 flex items-center gap-4">
            <div className="h-20 w-20 bg-white rounded-full p-1 shadow-lg">
              <img
                src={teamDetails.strBadge || "/placeholder.svg?height=80&width=80"}
                alt={`${teamDetails.strTeam} escudo`}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{teamDetails.strTeam}</h1>
              <p className="text-green-200">{teamDetails.strLeague}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-green-50 dark:bg-green-900">
              <TabsTrigger value="info" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Información
              </TabsTrigger>
              <TabsTrigger
                value="stadium"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
              >
                Estadio
              </TabsTrigger>
              <TabsTrigger value="social" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Redes Sociales
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-6">
              <Card>
                <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
                <CardHeader>
                  <CardTitle>Información del Equipo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="font-medium">País:</span> {teamDetails.strCountry}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Fundado en:</span> {teamDetails.intFormedYear}
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Liga:</span> {teamDetails.strLeague}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Abreviatura:</span> {teamDetails.strTeamShort || "N/A"}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Descripción</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {teamDetails.strDescriptionES ||
                        teamDetails.strDescriptionEN ||
                        "No hay descripción disponible para este equipo."}
                    </p>
                  </div>

                  <div className="flex justify-center mt-6">
                    <Button onClick={() => onPlayerView(teamId, teamDetails.strTeam)}>
                      <Users className="mr-2 h-4 w-4" /> Ver Jugadores
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stadium" className="mt-6">
              <Card>
                <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
                <CardHeader>
                  <CardTitle>Estadio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {teamDetails.strStadiumThumb && (
                    <div className="h-48 rounded-lg overflow-hidden">
                      <img
                        src={teamDetails.strStadiumThumb || "/placeholder.svg"}
                        alt={`${teamDetails.strStadium} estadio`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Nombre:</span> {teamDetails.strStadium || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Ubicación:</span> {teamDetails.strStadiumLocation || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Capacidad:</span> {teamDetails.intStadiumCapacity || "N/A"}
                    </div>
                  </div>

                  {teamDetails.strStadiumDescription && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Descripción del Estadio</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{teamDetails.strStadiumDescription}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="mt-6">
              <Card>
                <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
                <CardHeader>
                  <CardTitle>Redes Sociales y Web</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teamDetails.strWebsite && (
                      <a
                        href={formatSocialLink(teamDetails.strWebsite)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                      >
                        <Globe className="h-5 w-5 text-green-600" />
                        <span>Sitio Web Oficial</span>
                      </a>
                    )}
                    {teamDetails.strFacebook && (
                      <a
                        href={formatSocialLink(teamDetails.strFacebook)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                      >
                        <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                        </svg>
                        <span>Facebook</span>
                      </a>
                    )}
                    {teamDetails.strTwitter && (
                      <a
                        href={formatSocialLink(teamDetails.strTwitter)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                      >
                        <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
                        </svg>
                        <span>Twitter</span>
                      </a>
                    )}
                    {teamDetails.strInstagram && (
                      <a
                        href={formatSocialLink(teamDetails.strInstagram)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                      >
                        <svg className="h-5 w-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        <span>Instagram</span>
                      </a>
                    )}
                    {teamDetails.strYoutube && (
                      <a
                        href={formatSocialLink(teamDetails.strYoutube)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                      >
                        <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        <span>YouTube</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-1">
          <Card>
            <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
            <CardHeader>
              <CardTitle>Equipación</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {teamDetails.strEquipment ? (
                <div className="h-64 w-full flex items-center justify-center">
                  <img
                    src={teamDetails.strEquipment || "/placeholder.svg"}
                    alt={`${teamDetails.strTeam} camiseta`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No hay imagen de la equipación disponible</p>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
            <CardHeader>
              <CardTitle>Afición</CardTitle>
            </CardHeader>
            <CardContent>
              {teamDetails.strFanart4 ? (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={teamDetails.strFanart4 || "/placeholder.svg"}
                    alt={`${teamDetails.strTeam} afición`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No hay imagen de la afición disponible</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
