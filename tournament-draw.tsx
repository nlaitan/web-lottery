"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shuffle, Users, Trophy, Gift, Globe, Sparkles } from "lucide-react";
import type { Language } from "@/lib/types";
import { TRANSLATIONS, LANGUAGE_NAMES } from "@/lib/i18n";

interface Winner {
  name: string;
  originalIndex: number;
}

export default function Component() {
  const [language, setLanguage] = useState<Language>("spanish");
  const [numberOfLots, setNumberOfLots] = useState<number>(1);
  const [participants, setParticipants] = useState<string[]>([""]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isDrawn, setIsDrawn] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [visibleWinners, setVisibleWinners] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const t = TRANSLATIONS[language];

  // Update document title when language changes
  useEffect(() => {
    document.title = t.document_title;
  }, [language, t.document_title]);

  // useCallback
  const addParticipant = useCallback(() => {
    setParticipants([...participants, ""]);
    setIsDrawn(false);
    setWinners([]);

    // Focus on the new input after state update
    setTimeout(() => {
      const newIndex = participants.length;
      inputRefs.current[newIndex]?.focus();
    }, 0);
  }, [participants]);

  const removeParticipant = useCallback(
    (index: number) => {
      if (participants.length > 1) {
        const newParticipants = participants.filter((_, i) => i !== index);
        setParticipants(newParticipants);
        setIsDrawn(false);
        setWinners([]);
      }
    },
    [participants]
  );

  const handleNameChange = useCallback(
    (index: number, name: string) => {
      const newParticipants = [...participants];
      newParticipants[index] = name;
      setParticipants(newParticipants);
    },
    [participants]
  );

  const handleLotsChange = useCallback(
    (change: number) => {
      const newLots = Math.max(1, numberOfLots + change);
      setNumberOfLots(newLots);
      setIsDrawn(false);
      setWinners([]);
    },
    [numberOfLots]
  );

  const resetDraw = useCallback(() => {
    setIsDrawn(false);
    setWinners([]);
    setVisibleWinners(0);
    setIsDrawing(false);
  }, []);

  const drawLottery = useCallback(() => {
    resetDraw();
    const validParticipants = participants
      .map((name, index) => ({ name: name.trim(), originalIndex: index + 1 }))
      .filter((participant) => participant.name !== "");

    if (validParticipants.length === 0) {
      alert(t.alert_no_participants);
      return;
    }

    if (numberOfLots > validParticipants.length) {
      alert(
        t.alert_too_many_lots
          .replace("{lots}", numberOfLots.toString())
          .replace("{participants}", validParticipants.length.toString())
      );
      return;
    }

    // Start drawing animation
    setIsDrawing(true);
    setVisibleWinners(0);

    // Fisher-Yates shuffle
    const shuffled = [...validParticipants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Take the first 'numberOfLots' participants as winners
    const selectedWinners = shuffled.slice(0, numberOfLots);

    // Simulate drawing delay
    setTimeout(() => {
      setWinners(selectedWinners);
      setIsDrawn(true);
      setIsDrawing(false);
    }, 1500);
  }, [numberOfLots, participants, t]);

  // Animate winners appearing one by one
  useEffect(() => {
    if (isDrawn && winners.length > 0) {
      setVisibleWinners(0);
      const timer = setInterval(() => {
        setVisibleWinners((prev) => {
          if (prev < winners.length) {
            return prev + 1;
          }
          clearInterval(timer);
          return prev;
        });
      }, 300);

      return () => clearInterval(timer);
    }
  }, [isDrawn, winners.length]);

  const validParticipantCount = participants.filter(
    (name) => name.trim() !== ""
  ).length;

  const getWinnerText = (count: number) => (count === 1 ? t.winner : t.winners);
  const getParticipantText = (count: number) =>
    count === 1 ? t.participant : t.participants;

  // Add this useEffect to manage refs array length
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, participants.length);
  }, [participants.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(20px);
          }
          50% {
            opacity: 1;
            transform: scale(1.05) translateY(-5px);
          }
          70% {
            transform: scale(0.95) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
          }
        }

        .confetti {
          position: fixed;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #f1c40f;
          animation: confetti 2s linear infinite;
        }

        .confetti:nth-child(1) {
          left: 10%;
          animation-delay: 0s;
          background: #e74c3c;
        }
        .confetti:nth-child(2) {
          left: 20%;
          animation-delay: 0.5s;
          background: #3498db;
        }
        .confetti:nth-child(3) {
          left: 30%;
          animation-delay: 1s;
          background: #2ecc71;
        }
        .confetti:nth-child(4) {
          left: 40%;
          animation-delay: 1.5s;
          background: #f39c12;
        }
        .confetti:nth-child(5) {
          left: 50%;
          animation-delay: 2s;
          background: #9b59b6;
        }
        .confetti:nth-child(6) {
          left: 60%;
          animation-delay: 0.3s;
          background: #e67e22;
        }
        .confetti:nth-child(7) {
          left: 70%;
          animation-delay: 0.8s;
          background: #1abc9c;
        }
        .confetti:nth-child(8) {
          left: 80%;
          animation-delay: 1.3s;
          background: #34495e;
        }
        .confetti:nth-child(9) {
          left: 90%;
          animation-delay: 1.8s;
          background: #e91e63;
        }

        .winners-card {
          animation: slideInUp 0.6s ease-out;
        }

        .winner-item {
          animation: bounceIn 0.6s ease-out;
        }

        .drawing-button {
          animation: pulse 1.5s ease-in-out infinite;
        }

        .shimmer-effect {
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        .glow-effect {
          animation: glow 2s ease-in-out infinite;
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Confetti */}
      {isDrawn && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="confetti" />
          ))}
        </div>
      )}

      {/* Modern Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="float-animation mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg glow-effect">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            {t.main_title}
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-4 font-medium">
            {t.main_subtitle}
          </p>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            {t.main_description}
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Animaciones</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>10 Idiomas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>100% Aleatorio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Gratis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-16 space-y-6">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Gift className="w-6 h-6" />
                  {t.heading}
                </CardTitle>
                <CardDescription className="mt-2 text-base">
                  {t.subheading}
                </CardDescription>
              </div>
              <Select
                value={language}
                onValueChange={(value: Language) => setLanguage(value)}
              >
                <SelectTrigger className="w-40 bg-white/50 backdrop-blur-sm border-gray-200">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LANGUAGE_NAMES).map(([key, name]) => (
                    <SelectItem key={key} value={key}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Number of lots (winners) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Trophy className="w-4 h-4" />
                {t.lots_label}: {numberOfLots}
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleLotsChange(-1)}
                  disabled={numberOfLots <= 1 || isDrawing}
                  className="hover:bg-blue-50"
                >
                  -
                </Button>
                <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded text-sm font-medium min-w-[60px] text-center border">
                  {numberOfLots}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleLotsChange(1)}
                  disabled={numberOfLots >= 50 || isDrawing}
                  className="hover:bg-blue-50"
                >
                  +
                </Button>
              </div>
              <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                {t.drawing_status
                  .replace("{count}", numberOfLots.toString())
                  .replace("{winner}", getWinnerText(numberOfLots))
                  .replace("{total}", validParticipantCount.toString())
                  .replace(
                    "{participant}",
                    getParticipantText(validParticipantCount)
                  )}
              </p>
            </div>

            {/* Participants */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {t.participants_label}: {participants.length}
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addParticipant}
                  disabled={isDrawing}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200"
                >
                  + {t.add_participant_btn}
                </Button>
              </div>
              <div className="grid gap-3 max-h-60 overflow-y-auto bg-gray-50/50 p-4 rounded-lg">
                {participants.map((name, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 w-8">
                      #{index + 1}
                    </span>
                    <Input
                      // @ts-ignore
                      ref={(el) => (inputRefs.current[index] = el)}
                      placeholder={t.participant_placeholder.replace(
                        "{number}",
                        (index + 1).toString()
                      )}
                      value={name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      className="flex-1 bg-white/80 backdrop-blur-sm"
                      disabled={isDrawing}
                    />
                    {participants.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeParticipant(index)}
                        disabled={isDrawing}
                        className="hover:bg-red-50 hover:border-red-200"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Draw button */}
            <div className="flex gap-3">
              <Button
                onClick={drawLottery}
                className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg ${
                  isDrawing ? "drawing-button" : ""
                }`}
                size="lg"
                disabled={
                  validParticipantCount === 0 ||
                  numberOfLots > validParticipantCount ||
                  isDrawing
                }
              >
                <Shuffle className="w-4 h-4 mr-2" />
                {isDrawing ? "Sorteando..." : t.draw_winners_btn}
              </Button>
              {(isDrawn || isDrawing) && (
                <Button
                  onClick={resetDraw}
                  variant="outline"
                  size="lg"
                  disabled={isDrawing}
                  className="bg-white/80 backdrop-blur-sm"
                >
                  {t.reset_btn}
                </Button>
              )}
            </div>

            {/* Drawing animation */}
            {isDrawing && (
              <div className="text-center py-8">
                <div className="shimmer-effect h-8 w-48 mx-auto rounded mb-4"></div>
                <div className="shimmer-effect h-6 w-32 mx-auto rounded mb-2"></div>
                <div className="shimmer-effect h-6 w-40 mx-auto rounded"></div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Winners */}
        {isDrawn && winners.length > 0 && (
          <Card className="winners-card shadow-xl border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2 text-2xl">
                <Trophy className="w-6 h-6" />
                🎉 {t.winners_title} 🎉
              </CardTitle>
              <CardDescription className="text-center text-base">
                {t.winners_subtitle
                  .replace("{count}", winners.length.toString())
                  .replace("{winner}", getWinnerText(winners.length))}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {winners.map((winner, index) => (
                  <div
                    key={index}
                    className={`winner-item flex items-center justify-between p-4 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-lg shadow-md ${
                      index < visibleWinners ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      animationDelay: `${index * 300}ms`,
                      transition: "opacity 0.3s ease-in-out",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-yellow-900 text-lg">
                        {winner.name}
                      </span>
                    </div>
                    <span className="text-sm text-yellow-700 bg-yellow-200/50 px-2 py-1 rounded">
                      {t.participant_number.replace(
                        "{number}",
                        winner.originalIndex.toString()
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
