"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, SearchIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface Team {
  idTeam: string
  strTeam: string
  strTeamBadge: string
  strLeague: string
  strCountry: string
}

interface Player {
  idPlayer: string
  idTeam: string
  strPlayer: string
  strTeam: string
  strPosition: string
  strCutout: string | null
  strThumb: string | null
  strNationality: string
}

interface SearchSectionProps {
  onTeamSelect: (teamId: string, teamName: string) => void
  onPlayerTeamSelect: (teamId: string, teamName: string) => void
}

export default function SearchSection({ onTeamSelect, onPlayerTeamSelect }: SearchSectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState<"teams" | "players">("teams")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      if (searchType === "teams") {
        const response = await fetch(
          `https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=${encodeURIComponent(searchTerm)}`,
        )

        if (!response.ok) {
          throw new Error("Error al buscar equipos")
        }

        const data = await response.json()
        setTeams(data.teams || [])
        setPlayers([])
      } else {
        const response = await fetch(
          `https://www.thesportsdb.com/api/v1/json/123/searchplayers.php?p=${encodeURIComponent(searchTerm)}`,
        )

        if (!response.ok) {
          throw new Error("Error al buscar jugadores")
        }

        const data = await response.json()
        setPlayers(data.player || [])
        setTeams([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
      setTeams([])
      setPlayers([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-800 dark:text-green-300">Búsqueda</h2>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar equipos o jugadores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="border-green-200 dark:border-green-800"
          />
        </div>
        <div className="flex gap-2">
          <Tabs
            value={searchType}
            onValueChange={(value) => setSearchType(value as "teams" | "players")}
            className="w-full"
          >
            <TabsList className="bg-green-50 dark:bg-green-900">
              <TabsTrigger value="teams" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Equipos
              </TabsTrigger>
              <TabsTrigger
                value="players"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
              >
                Jugadores
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={handleSearch} disabled={loading} className="bg-green-600 hover:bg-green-700">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">Buscar</span>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="my-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : (
        <>
          {searchType === "teams" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {teams.map((team) => (
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
                    <div className="h-24 w-24 flex items-center justify-center mb-4">
                      <img
                        src={team.strTeamBadge || "/placeholder.svg"}
                        alt={`${team.strTeam} logo`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-center">{team.strTeam}</h3>
                    <p className="text-sm text-muted-foreground">{team.strCountry}</p>
                  </CardContent>
                </Card>
              ))}
              {teams.length === 0 && hasSearched && (
                <div className="col-span-full text-center py-8">
                  No se encontraron equipos que coincidan con la búsqueda
                </div>
              )}
            </div>
          )}

          {searchType === "players" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {players.map((player) => (
                <Card
                  key={player.idPlayer}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-green-100 dark:border-green-900 hover:border-green-300 dark:hover:border-green-700"
                  onClick={() => player.idTeam && onPlayerTeamSelect(player.idTeam, player.strTeam)}
                >
                  <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
                      <img
                        src={player.strCutout || player.strThumb || "/placeholder.svg?height=96&width=96"}
                        alt={player.strPlayer}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=96&width=96"
                        }}
                      />
                    </div>
                    <h3 className="font-bold text-lg text-center">{player.strPlayer}</h3>
                    <Badge className="mt-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 hover:bg-green-100 dark:hover:bg-green-900">
                      {player.strPosition || "N/A"}
                    </Badge>
                    <div className="mt-2 text-sm text-center">
                      <p>{player.strTeam}</p>
                      <p className="text-muted-foreground">{player.strNationality}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {players.length === 0 && hasSearched && (
                <div className="col-span-full text-center py-8">
                  No se encontraron jugadores que coincidan con la búsqueda
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
