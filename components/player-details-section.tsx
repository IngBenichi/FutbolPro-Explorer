"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Calendar, Flag, Trophy, Briefcase, ArrowLeft, MapPin, User, Shield } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PlayerDetails {
  idPlayer: string
  strPlayer: string
  strNationality: string
  strTeam: string
  strPosition: string
  strNumber: string
  dateBorn: string
  strBirthLocation: string
  strDescriptionEN: string
  strHeight: string
  strWeight: string
  strThumb: string
  strCutout: string
  strFanart1: string
  strBanner: string
  strFacebook: string
  strTwitter: string
  strInstagram: string
}

interface PlayerHonour {
  id: string
  idPlayer: string
  idTeam: string
  strHonour: string
  strTeam: string
  strSeason: string
}

interface PlayerFormerTeam {
  id: string
  idPlayer: string
  idFormerTeam: string
  strFormerTeam: string
  strSport: string
  strJoined: string
  strDeparted: string
}

interface PlayerContract {
  id: string
  idPlayer: string
  idTeam: string
  strTeam: string
  strSport: string
  strYearStart: string
  strYearEnd: string
  strWage: string
}

interface PlayerDetailsSectionProps {
  playerId: string
  onBack: () => void
}

export default function PlayerDetailsSection({ playerId, onBack }: PlayerDetailsSectionProps) {
  const [playerDetails, setPlayerDetails] = useState<PlayerDetails | null>(null)
  const [playerHonours, setPlayerHonours] = useState<PlayerHonour[]>([])
  const [playerFormerTeams, setPlayerFormerTeams] = useState<PlayerFormerTeam[]>([])
  const [playerContracts, setPlayerContracts] = useState<PlayerContract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch player details
        const detailsResponse = await fetch(
          `https://www.thesportsdb.com/api/v1/json/123/lookupplayer.php?id=${playerId}`,
        )

        if (!detailsResponse.ok) {
          throw new Error("Error al cargar detalles del jugador")
        }

        const detailsData = await detailsResponse.json()

        if (detailsData.players && detailsData.players.length > 0) {
          setPlayerDetails(detailsData.players[0])

          // Fetch player honours
          try {
            const honoursResponse = await fetch(
              `https://www.thesportsdb.com/api/v1/json/123/lookuphonours.php?id=${playerId}`,
            )
            if (honoursResponse.ok) {
              const honoursData = await honoursResponse.json()
              if (honoursData.honours) {
                setPlayerHonours(honoursData.honours)
              }
            }
          } catch (err) {
            console.error("Error fetching honours:", err)
          }

          // Fetch former teams
          try {
            const formerTeamsResponse = await fetch(
              `https://www.thesportsdb.com/api/v1/json/123/lookupformerteams.php?id=${playerId}`,
            )
            if (formerTeamsResponse.ok) {
              const formerTeamsData = await formerTeamsResponse.json()
              if (formerTeamsData.formerteams) {
                setPlayerFormerTeams(formerTeamsData.formerteams)
              }
            }
          } catch (err) {
            console.error("Error fetching former teams:", err)
          }

          // Fetch contracts
          try {
            const contractsResponse = await fetch(
              `https://www.thesportsdb.com/api/v1/json/123/lookupcontracts.php?id=${playerId}`,
            )
            if (contractsResponse.ok) {
              const contractsData = await contractsResponse.json()
              if (contractsData.contracts) {
                setPlayerContracts(contractsData.contracts)
              }
            }
          } catch (err) {
            console.error("Error fetching contracts:", err)
          }
        } else {
          throw new Error("No se encontraron detalles para este jugador")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    if (playerId) {
      fetchPlayerDetails()
    }
  }, [playerId])

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

  const formatSocialLink = (url: string) => {
    if (!url) return ""
    if (url.startsWith("http")) return url
    return `https://${url}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (error || !playerDetails) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertDescription>{error || "No se pudieron cargar los detalles del jugador"}</AlertDescription>
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
          backgroundImage: `url(${playerDetails.strBanner || playerDetails.strFanart1 || "/placeholder.svg?height=240&width=1200"})`,
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6 flex items-center gap-4">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-white p-1 shadow-lg">
              <img
                src={playerDetails.strCutout || playerDetails.strThumb || "/placeholder.svg?height=96&width=96"}
                alt={playerDetails.strPlayer}
                className="h-full w-full object-contain"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=96&width=96"
                }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{playerDetails.strPlayer}</h1>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500">{playerDetails.strPosition || "N/A"}</Badge>
                <p className="text-green-200">{playerDetails.strTeam}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full grid grid-cols-4 bg-green-50 dark:bg-green-900">
          <TabsTrigger value="info" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
            Información
          </TabsTrigger>
          <TabsTrigger value="honours" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
            Palmarés
          </TabsTrigger>
          <TabsTrigger value="teams" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
            Equipos Anteriores
          </TabsTrigger>
          <TabsTrigger value="contracts" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
            Contratos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Nombre:</span> {playerDetails.strPlayer}
                    </div>
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Nacionalidad:</span> {playerDetails.strNationality || "N/A"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Fecha de nacimiento:</span> {formatDate(playerDetails.dateBorn)}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Lugar de nacimiento:</span>{" "}
                      {playerDetails.strBirthLocation || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Altura:</span> {playerDetails.strHeight || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Peso:</span> {playerDetails.strWeight || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Posición:</span> {playerDetails.strPosition || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Número:</span> {playerDetails.strNumber || "N/A"}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Biografía</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {playerDetails.strDescriptionEN || "No hay información disponible sobre este jugador."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1">
              <Card>
                <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
                <CardHeader>
                  <CardTitle>Redes Sociales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {playerDetails.strFacebook && (
                      <a
                        href={formatSocialLink(playerDetails.strFacebook)}
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
                    {playerDetails.strTwitter && (
                      <a
                        href={formatSocialLink(playerDetails.strTwitter)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                      >
                        <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
                        </svg>
                        <span>Twitter</span>
                      </a>
                    )}
                    {playerDetails.strInstagram && (
                      <a
                        href={formatSocialLink(playerDetails.strInstagram)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                      >
                        <svg className="h-5 w-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225 1.664 4.771 4.919 4.919 1.266.058 1.644.07 4.85.07 3.204 0 3.584-.012 4.849-.07 4.358-.2 6.78 2.618 6.98 6.98.059 1.281-.073 1.689-.073 4.948 0 3.205.013 3.668.072 4.948.149 3.227 1.664 4.771 4.919 4.919 1.266.057 1.645.069 4.849.069 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        <span>Instagram</span>
                      </a>
                    )}
                    {!playerDetails.strFacebook && !playerDetails.strTwitter && !playerDetails.strInstagram && (
                      <p className="text-center text-muted-foreground">No hay redes sociales disponibles</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="honours" className="mt-6">
          <Card>
            <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Palmarés
              </CardTitle>
            </CardHeader>
            <CardContent>
              {playerHonours.length > 0 ? (
                <Table>
                  <TableHeader className="bg-green-50 dark:bg-green-900">
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Equipo</TableHead>
                      <TableHead>Temporada</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {playerHonours.map((honour, index) => (
                      <TableRow key={index} className="hover:bg-green-50 dark:hover:bg-green-900/30">
                        <TableCell className="font-medium">{honour.strHonour}</TableCell>
                        <TableCell>{honour.strTeam}</TableCell>
                        <TableCell>{honour.strSeason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-4 text-muted-foreground">No hay palmarés registrado para este jugador</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          <Card>
            <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Equipos Anteriores
              </CardTitle>
            </CardHeader>
            <CardContent>
              {playerFormerTeams.length > 0 ? (
                <Table>
                  <TableHeader className="bg-green-50 dark:bg-green-900">
                    <TableRow>
                      <TableHead>Equipo</TableHead>
                      <TableHead>Deporte</TableHead>
                      <TableHead>Llegada</TableHead>
                      <TableHead>Salida</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {playerFormerTeams.map((team, index) => (
                      <TableRow key={index} className="hover:bg-green-50 dark:hover:bg-green-900/30">
                        <TableCell className="font-medium">{team.strFormerTeam}</TableCell>
                        <TableCell>{team.strSport}</TableCell>
                        <TableCell>{team.strJoined || "N/A"}</TableCell>
                        <TableCell>{team.strDeparted || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No hay equipos anteriores registrados para este jugador
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="mt-6">
          <Card>
            <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-green-500" />
                Contratos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {playerContracts.length > 0 ? (
                <Table>
                  <TableHeader className="bg-green-50 dark:bg-green-900">
                    <TableRow>
                      <TableHead>Equipo</TableHead>
                      <TableHead>Deporte</TableHead>
                      <TableHead>Inicio</TableHead>
                      <TableHead>Fin</TableHead>
                      <TableHead>Salario</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {playerContracts.map((contract, index) => (
                      <TableRow key={index} className="hover:bg-green-50 dark:hover:bg-green-900/30">
                        <TableCell className="font-medium">{contract.strTeam}</TableCell>
                        <TableCell>{contract.strSport}</TableCell>
                        <TableCell>{contract.strYearStart || "N/A"}</TableCell>
                        <TableCell>{contract.strYearEnd || "N/A"}</TableCell>
                        <TableCell>{contract.strWage || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-4 text-muted-foreground">No hay contratos registrados para este jugador</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
