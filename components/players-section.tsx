"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Calendar, Flag, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PlayerDetailsSection from "@/components/player-details-section"

interface Player {
  idPlayer: string
  strPlayer: string
  strPosition: string
  dateBorn: string
  strCutout: string | null
  strThumb: string | null
  strNationality: string
  strHeight: string
  strWeight: string
  strDescriptionEN: string
}

interface PlayersProps {
  teamId: string
  teamName: string
}

export default function PlayersSection({ teamId, teamName }: PlayersProps) {
  const [players, setPlayers] = useState<Player[]>([])
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [positionFilter, setPositionFilter] = useState("all")
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true)
        setError(null)
        setPlayers([]) // Limpiar jugadores anteriores
        setFilteredPlayers([])

        console.log(`Fetching players for team ID: ${teamId}, name: ${teamName}`) // Log para depuración

        const response = await fetch(`https://www.thesportsdb.com/api/v1/json/123/lookup_all_players.php?id=${teamId}`)

        if (!response.ok) {
          throw new Error(`Error al cargar jugadores del equipo ${teamName}`)
        }

        const data = await response.json()

        if (data.player) {
          console.log(`Loaded ${data.player.length} players for ${teamName}`) // Log para depuración
          setPlayers(data.player)
          setFilteredPlayers(data.player)
        } else {
          throw new Error(`No se encontraron jugadores para ${teamName}`)
        }
      } catch (err) {
        console.error(`Error fetching players:`, err) // Log para depuración
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    if (teamId) {
      fetchPlayers()
    }
  }, [teamId, teamName])

  useEffect(() => {
    let result = [...players]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter((player) => player.strPlayer.toLowerCase().includes(term))
    }

    if (positionFilter !== "all") {
      result = result.filter((player) => player.strPosition === positionFilter)
    }

    setFilteredPlayers(result)
  }, [searchTerm, positionFilter, players])

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

  const getUniquePositions = () => {
    const positions = new Set<string>()
    players.forEach((player) => {
      if (player.strPosition) {
        positions.add(player.strPosition)
      }
    })
    return Array.from(positions)
  }

  if (selectedPlayerId) {
    return <PlayerDetailsSection playerId={selectedPlayerId} onBack={() => setSelectedPlayerId(null)} />
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (selectedPlayer) {
    return (
      <div className="space-y-6">
        <Button variant="outline" className="mb-4" onClick={() => setSelectedPlayer(null)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a la lista
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
              <div className="p-6 flex flex-col items-center">
                <div className="h-48 w-48 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
                  <img
                    src={selectedPlayer.strCutout || selectedPlayer.strThumb || "/placeholder.svg?height=200&width=200"}
                    alt={selectedPlayer.strPlayer}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=200"
                    }}
                  />
                </div>
                <h2 className="text-2xl font-bold text-center">{selectedPlayer.strPlayer}</h2>
                <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  {selectedPlayer.strPosition || "N/A"}
                </Badge>
                <Button
                  onClick={() => setSelectedPlayerId(selectedPlayer.idPlayer)}
                  className="mt-4 bg-green-600 hover:bg-green-700"
                >
                  Ver perfil completo
                </Button>
              </div>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
              <CardHeader>
                <CardTitle>Información del Jugador</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Fecha de nacimiento:</span> {formatDate(selectedPlayer.dateBorn)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Nacionalidad:</span> {selectedPlayer.strNationality || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Altura:</span> {selectedPlayer.strHeight || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Peso:</span> {selectedPlayer.strWeight || "N/A"}
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-medium mb-2">Biografía</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedPlayer.strDescriptionEN || "No hay información disponible sobre este jugador."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-300">Jugadores de {teamName}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            placeholder="Buscar jugadores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-green-200 dark:border-green-800"
          />
        </div>
        <div>
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="border-green-200 dark:border-green-800">
              <SelectValue placeholder="Filtrar por posición" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las posiciones</SelectItem>
              {getUniquePositions().map((position) => (
                <SelectItem key={position} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="w-full grid grid-cols-2 bg-green-50 dark:bg-green-900">
          <TabsTrigger value="table" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
            Tabla
          </TabsTrigger>
          <TabsTrigger value="cards" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
            Tarjetas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-6">
          <div className="rounded-lg border border-green-100 dark:border-green-900 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-green-50 dark:bg-green-900">
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Posición</TableHead>
                  <TableHead>Nacionalidad</TableHead>
                  <TableHead>Fecha de Nacimiento</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.map((player) => (
                  <TableRow key={player.idPlayer} className="hover:bg-green-50 dark:hover:bg-green-900/30">
                    <TableCell>
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={player.strCutout || player.strThumb || "/placeholder.svg?height=40&width=40"}
                          alt={player.strPlayer}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40"
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{player.strPlayer}</TableCell>
                    <TableCell>{player.strPosition || "N/A"}</TableCell>
                    <TableCell>{player.strNationality || "N/A"}</TableCell>
                    <TableCell>{formatDate(player.dateBorn)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPlayer(player)}
                        className="hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30"
                      >
                        Ver detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPlayers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No se encontraron jugadores que coincidan con los filtros
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="cards" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPlayers.map((player) => (
              <Card
                key={player.idPlayer}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-green-100 dark:border-green-900"
                onClick={() => setSelectedPlayer(player)}
              >
                <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{player.strPlayer}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={player.strCutout || player.strThumb || "/placeholder.svg?height=64&width=64"}
                        alt={player.strPlayer}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=64&width=64"
                        }}
                      />
                    </div>
                    <div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 hover:bg-green-100 dark:hover:bg-green-900">
                        {player.strPosition || "N/A"}
                      </Badge>
                      <p className="text-sm mt-1">{player.strNationality || "N/A"}</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-green-600" />
                      <span>{formatDate(player.dateBorn)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredPlayers.length === 0 && (
              <div className="col-span-full text-center py-8">
                No se encontraron jugadores que coincidan con los filtros
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
