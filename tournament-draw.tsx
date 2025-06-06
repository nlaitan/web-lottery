"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shuffle, Users, Trophy, Gift, Globe, Sparkles } from "lucide-react"

interface Winner {
  name: string
  originalIndex: number
}

const translations = {
  english: {
    heading: "Lottery Draw",
    subheading: "Draw random winners from your participants",
    lots_label: "Lots (Winners to Draw)",
    drawing_status: "Drawing {count} {winner} from {total} {participant}",
    participants_label: "Participants",
    participant_placeholder: "Participant {number}",
    add_participant_btn: "Add Participant",
    draw_winners_btn: "Draw Winners",
    reset_btn: "Reset",
    winners_title: "Winners!",
    winners_subtitle: "{count} {winner} randomly selected",
    participant_number: "Participant #{number}",
    winner: "winner",
    winners: "winners",
    participant: "participant",
    participants: "participants",
    alert_no_participants: "Please enter at least one participant name",
    alert_too_many_lots: "Cannot draw {lots} winners from {participants} participants",
    main_title: "Lucky Draw",
    main_subtitle: "Fair & Random Lottery System",
    main_description: "Create exciting lottery draws with animated results and multi-language support",
    document_title: "Lucky Draw - Fair & Random Lottery System",
  },
  spanish: {
    heading: "Sorteo",
    subheading: "Sortea ganadores al azar entre tus participantes",
    lots_label: "Premios (Ganadores a elegir)",
    drawing_status: "Seleccionando {count} {winner} entre {total} {participant}",
    participants_label: "Participantes",
    participant_placeholder: "Participante {number}",
    add_participant_btn: "Agregar participante",
    draw_winners_btn: "Sortear ganadores",
    reset_btn: "Reiniciar",
    winners_title: "¡Ganadores!",
    winners_subtitle: "{count} {winner} seleccionados aleatoriamente",
    participant_number: "Participante #{number}",
    winner: "ganador",
    winners: "ganadores",
    participant: "participante",
    participants: "participantes",
    alert_no_participants: "Por favor ingresa al menos un nombre de participante",
    alert_too_many_lots: "No se pueden sortear {lots} ganadores entre {participants} participantes",
    main_title: "Sorteo de la Suerte",
    main_subtitle: "Sistema de Lotería Justo y Aleatorio",
    main_description: "Crea sorteos emocionantes con resultados animados y soporte multiidioma",
    document_title: "SortAr - Sorteos en línea aleatorios y justos",
  },
  french: {
    heading: "Tirage au sort",
    subheading: "Tirez des gagnants au hasard parmi vos participants",
    lots_label: "Lots (Gagnants à tirer)",
    drawing_status: "Tirage de {count} {winner} parmi {total} {participant}",
    participants_label: "Participants",
    participant_placeholder: "Participant {number}",
    add_participant_btn: "Ajouter un participant",
    draw_winners_btn: "Tirer les gagnants",
    reset_btn: "Réinitialiser",
    winners_title: "Gagnants !",
    winners_subtitle: "{count} {winner} sélectionnés aléatoirement",
    participant_number: "Participant #{number}",
    winner: "gagnant",
    winners: "gagnants",
    participant: "participant",
    participants: "participants",
    alert_no_participants: "Veuillez entrer au moins un nom de participant",
    alert_too_many_lots: "Impossible de tirer {lots} gagnants parmi {participants} participants",
    main_title: "Tirage Chanceux",
    main_subtitle: "Système de Loterie Équitable et Aléatoire",
    main_description: "Créez des tirages passionnants avec des résultats animés et un support multilingue",
    document_title: "Tirage Chanceux - Système de loterie équitable et aléatoire",
  },
  german: {
    heading: "Auslosung",
    subheading: "Ziehe zufällig Gewinner aus deinen Teilnehmern",
    lots_label: "Lose (Gewinner zu ziehen)",
    drawing_status: "Ziehe {count} {winner} aus {total} {participant}",
    participants_label: "Teilnehmer",
    participant_placeholder: "Teilnehmer {number}",
    add_participant_btn: "Teilnehmer hinzufügen",
    draw_winners_btn: "Gewinner ziehen",
    reset_btn: "Zurücksetzen",
    winners_title: "Gewinner!",
    winners_subtitle: "{count} {winner} zufällig ausgewählt",
    participant_number: "Teilnehmer #{number}",
    winner: "Gewinner",
    winners: "Gewinner",
    participant: "Teilnehmer",
    participants: "Teilnehmer",
    alert_no_participants: "Bitte geben Sie mindestens einen Teilnehmernamen ein",
    alert_too_many_lots: "Kann nicht {lots} Gewinner aus {participants} Teilnehmern ziehen",
    main_title: "Glücks-Ziehung",
    main_subtitle: "Faires & Zufälliges Lotteriesystem",
    main_description:
      "Erstellen Sie aufregende Auslosungen mit animierten Ergebnissen und mehrsprachiger Unterstützung",
    document_title: "Glücks-Ziehung - Faires und zufälliges Lotteriesystem",
  },
  italian: {
    heading: "Estrazione",
    subheading: "Estrai vincitori casuali dai tuoi partecipanti",
    lots_label: "Lotti (Vincitori da estrarre)",
    drawing_status: "Estraendo {count} {winner} da {total} {participant}",
    participants_label: "Partecipanti",
    participant_placeholder: "Partecipante {number}",
    add_participant_btn: "Aggiungi partecipante",
    draw_winners_btn: "Estrarre i vincitori",
    reset_btn: "Ripristina",
    winners_title: "Vincitori!",
    winners_subtitle: "{count} {winner} selezionati casualmente",
    participant_number: "Partecipante #{number}",
    winner: "vincitore",
    winners: "vincitori",
    participant: "partecipante",
    participants: "partecipanti",
    alert_no_participants: "Inserisci almeno un nome di partecipante",
    alert_too_many_lots: "Impossibile estrarre {lots} vincitori da {participants} partecipanti",
    main_title: "Estrazione Fortunata",
    main_subtitle: "Sistema di Lotteria Equo e Casuale",
    main_description: "Crea estrazioni emozionanti con risultati animati e supporto multilingue",
    document_title: "Estrazione Fortunata - Sistema di lotteria equo e casuale",
  },
  portuguese_br: {
    heading: "Sorteio",
    subheading: "Sorteie vencedores aleatórios entre seus participantes",
    lots_label: "Lotes (Vencedores a sortear)",
    drawing_status: "Sorteando {count} {winner} entre {total} {participant}",
    participants_label: "Participantes",
    participant_placeholder: "Participante {number}",
    add_participant_btn: "Adicionar participante",
    draw_winners_btn: "Sortear vencedores",
    reset_btn: "Reiniciar",
    winners_title: "Vencedores!",
    winners_subtitle: "{count} {winner} selecionados aleatoriamente",
    participant_number: "Participante #{number}",
    winner: "vencedor",
    winners: "vencedores",
    participant: "participante",
    participants: "participantes",
    alert_no_participants: "Por favor, insira pelo menos um nome de participante",
    alert_too_many_lots: "Não é possível sortear {lots} vencedores entre {participants} participantes",
    main_title: "Sorteio da Sorte",
    main_subtitle: "Sistema de Loteria Justo e Aleatório",
    main_description: "Crie sorteios emocionantes com resultados animados e suporte multilíngue",
    document_title: "Sorteio da Sorte - Sistema de loteria justo e aleatório",
  },
  japanese: {
    heading: "抽選",
    subheading: "参加者からランダムに当選者を選びます",
    lots_label: "当選枠（選ぶ当選者数）",
    drawing_status: "{total}人の{participant}から{count}人を抽選中",
    participants_label: "参加者",
    participant_placeholder: "参加者 {number}",
    add_participant_btn: "参加者を追加",
    draw_winners_btn: "当選者を抽選",
    reset_btn: "リセット",
    winners_title: "当選者！",
    winners_subtitle: "{count}人がランダムに選ばれました",
    participant_number: "参加者 #{number}",
    winner: "当選者",
    winners: "当選者",
    participant: "参加者",
    participants: "参加者",
    alert_no_participants: "少なくとも1人の参加者名を入力してください",
    alert_too_many_lots: "{participants}人の参加者から{lots}人の当選者を選ぶことはできません",
    main_title: "ラッキードロー",
    main_subtitle: "公正でランダムな抽選システム",
    main_description: "アニメーション結果と多言語サポートで魅力的な抽選を作成",
    document_title: "ラッキードロー - 公正でランダムな抽選システム",
  },
  chinese_simplified: {
    heading: "抽奖",
    subheading: "从参与者中随机抽取获奖者",
    lots_label: "奖项（抽取获奖者数）",
    drawing_status: "正在从{total}名{participant}中抽取{count}名{winner}",
    participants_label: "参与者",
    participant_placeholder: "参与者 {number}",
    add_participant_btn: "添加参与者",
    draw_winners_btn: "抽取获奖者",
    reset_btn: "重置",
    winners_title: "获奖者！",
    winners_subtitle: "随机选出{count}名{winner}",
    participant_number: "参与者 #{number}",
    winner: "获奖者",
    winners: "获奖者",
    participant: "参与者",
    participants: "参与者",
    alert_no_participants: "请至少输入一个参与者姓名",
    alert_too_many_lots: "无法从{participants}名参与者中抽取{lots}名获奖者",
    main_title: "幸运抽奖",
    main_subtitle: "公平随机抽奖系统",
    main_description: "创建具有动画效果和多语言支持的精彩抽奖",
    document_title: "幸运抽奖 - 公平随机抽奖系统",
  },
  arabic: {
    heading: "سحب اليانصيب",
    subheading: "اختَر فائزين عشوائيًا من مشاركيك",
    lots_label: "الجوائز (عدد الفائزين المطلوب سحبهم)",
    drawing_status: "جاري سحب {count} {winner} من {total} {participant}",
    participants_label: "المشاركون",
    participant_placeholder: "المشارك {number}",
    add_participant_btn: "إضافة مشارك",
    draw_winners_btn: "سحب الفائزين",
    reset_btn: "إعادة تعيين",
    winners_title: "الفائزون!",
    winners_subtitle: "تم اختيار {count} {winner} عشوائيًا",
    participant_number: "المشارك #{number}",
    winner: "فائز",
    winners: "فائزين",
    participant: "مشارك",
    participants: "مشاركين",
    alert_no_participants: "يرجى إدخال اسم مشارك واحد على الأقل",
    alert_too_many_lots: "لا يمكن سحب {lots} فائزين من {participants} مشاركين",
    main_title: "السحب المحظوظ",
    main_subtitle: "نظام يانصيب عادل وعشوائي",
    main_description: "أنشئ سحوبات مثيرة مع نتائج متحركة ودعم متعدد اللغات",
    document_title: "السحب المحظوظ - نظام يانصيب عادل وعشوائي",
  },
  hindi: {
    heading: "लॉटरी ड्रॉ",
    subheading: "अपने प्रतिभागियों में से यादृच्छिक विजेता चुनें",
    lots_label: "लॉट्स (चयनित विजेताओं की संख्या)",
    drawing_status: "{total} {participant} में से {count} {winner} चुना जा रहा है",
    participants_label: "प्रतिभागी",
    participant_placeholder: "प्रतिभागी {number}",
    add_participant_btn: "प्रतिभागी जोड़ें",
    draw_winners_btn: "विजेताओं को चुनें",
    reset_btn: "रीसेट करें",
    winners_title: "विजेता!",
    winners_subtitle: "{count} {winner} यादृच्छिक रूप से चुने गए",
    participant_number: "प्रतिभागी #{number}",
    winner: "विजेता",
    winners: "विजेता",
    participant: "प्रतिभागी",
    participants: "प्रतिभागी",
    alert_no_participants: "कृपया कम से कम एक प्रतिभागी का नाम दर्ज करें",
    alert_too_many_lots: "{participants} प्रतिभागियों में से {lots} विजेता नहीं चुन सकते",
    main_title: "भाग्यशाली ड्रॉ",
    main_subtitle: "निष्पक्ष और यादृच्छिक लॉटरी सिस्टम",
    main_description: "एनिमेटेड परिणामों और बहुभाषी समर्थन के साथ रोमांचक लॉटरी बनाएं",
    document_title: "भाग्यशाली ड्रॉ - निष्पक्ष और यादृच्छिक लॉटरी सिस्टम",
  },
}

type Language = keyof typeof translations

export default function Component() {
  const [language, setLanguage] = useState<Language>("spanish")
  const [numberOfLots, setNumberOfLots] = useState<number>(1)
  const [participants, setParticipants] = useState<string[]>([""])
  const [winners, setWinners] = useState<Winner[]>([])
  const [isDrawn, setIsDrawn] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [visibleWinners, setVisibleWinners] = useState<number>(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const t = translations[language]

  // Update document title when language changes
  useEffect(() => {
    document.title = t.document_title
  }, [language, t.document_title])

  const addParticipant = () => {
    setParticipants([...participants, ""])
    setIsDrawn(false)
    setWinners([])

    // Focus on the new input after state update
    setTimeout(() => {
      const newIndex = participants.length
      inputRefs.current[newIndex]?.focus()
    }, 0)
  }

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      const newParticipants = participants.filter((_, i) => i !== index)
      setParticipants(newParticipants)
      setIsDrawn(false)
      setWinners([])
    }
  }

  const handleNameChange = (index: number, name: string) => {
    const newParticipants = [...participants]
    newParticipants[index] = name
    setParticipants(newParticipants)
  }

  const handleLotsChange = (change: number) => {
    const newLots = Math.max(1, numberOfLots + change)
    setNumberOfLots(newLots)
    setIsDrawn(false)
    setWinners([])
  }

  const resetDraw = () => {
    setIsDrawn(false)
    setWinners([])
    setVisibleWinners(0)
    setIsDrawing(false)
  }

  const drawLottery = () => {
    resetDraw()
    const validParticipants = participants
      .map((name, index) => ({ name: name.trim(), originalIndex: index + 1 }))
      .filter((participant) => participant.name !== "")

    if (validParticipants.length === 0) {
      alert(t.alert_no_participants)
      return
    }

    if (numberOfLots > validParticipants.length) {
      alert(
        t.alert_too_many_lots
          .replace("{lots}", numberOfLots.toString())
          .replace("{participants}", validParticipants.length.toString()),
      )
      return
    }

    // Start drawing animation
    setIsDrawing(true)
    setVisibleWinners(0)

    // Fisher-Yates shuffle
    const shuffled = [...validParticipants]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Take the first 'numberOfLots' participants as winners
    const selectedWinners = shuffled.slice(0, numberOfLots)

    // Simulate drawing delay
    setTimeout(() => {
      setWinners(selectedWinners)
      setIsDrawn(true)
      setIsDrawing(false)
    }, 1500)
  }

  // Animate winners appearing one by one
  useEffect(() => {
    if (isDrawn && winners.length > 0) {
      setVisibleWinners(0)
      const timer = setInterval(() => {
        setVisibleWinners((prev) => {
          if (prev < winners.length) {
            return prev + 1
          }
          clearInterval(timer)
          return prev
        })
      }, 300)

      return () => clearInterval(timer)
    }
  }, [isDrawn, winners.length])

  const validParticipantCount = participants.filter((name) => name.trim() !== "").length

  const getWinnerText = (count: number) => (count === 1 ? t.winner : t.winners)
  const getParticipantText = (count: number) => (count === 1 ? t.participant : t.participants)

  const languageNames: Record<Language, string> = {
    english: "English",
    spanish: "Español",
    french: "Français",
    german: "Deutsch",
    italian: "Italiano",
    portuguese_br: "Português (BR)",
    japanese: "日本語",
    chinese_simplified: "中文 (简体)",
    arabic: "العربية",
    hindi: "हिन्दी",
  }

  // Add this useEffect to manage refs array length
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, participants.length)
  }, [participants.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <style jsx>{`
        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
          50% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
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
          0%, 100% {
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
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes glow {
          0%, 100% {
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
        
        .confetti:nth-child(1) { left: 10%; animation-delay: 0s; background: #e74c3c; }
        .confetti:nth-child(2) { left: 20%; animation-delay: 0.5s; background: #3498db; }
        .confetti:nth-child(3) { left: 30%; animation-delay: 1s; background: #2ecc71; }
        .confetti:nth-child(4) { left: 40%; animation-delay: 1.5s; background: #f39c12; }
        .confetti:nth-child(5) { left: 50%; animation-delay: 2s; background: #9b59b6; }
        .confetti:nth-child(6) { left: 60%; animation-delay: 0.3s; background: #e67e22; }
        .confetti:nth-child(7) { left: 70%; animation-delay: 0.8s; background: #1abc9c; }
        .confetti:nth-child(8) { left: 80%; animation-delay: 1.3s; background: #34495e; }
        .confetti:nth-child(9) { left: 90%; animation-delay: 1.8s; background: #e91e63; }
        
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
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
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

          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">{t.main_title}</h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-4 font-medium">{t.main_subtitle}</p>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">{t.main_description}</p>

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
                <CardDescription className="mt-2 text-base">{t.subheading}</CardDescription>
              </div>
              <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                <SelectTrigger className="w-40 bg-white/50 backdrop-blur-sm border-gray-200">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(languageNames).map(([key, name]) => (
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
                  .replace("{participant}", getParticipantText(validParticipantCount))}
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
                    <span className="text-sm font-medium text-gray-500 w-8">#{index + 1}</span>
                    <Input
                      ref={(el) => (inputRefs.current[index] = el)}
                      placeholder={t.participant_placeholder.replace("{number}", (index + 1).toString())}
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
                className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg ${isDrawing ? "drawing-button" : ""}`}
                size="lg"
                disabled={validParticipantCount === 0 || numberOfLots > validParticipantCount || isDrawing}
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
                <Trophy className="w-6 h-6" />🎉 {t.winners_title} 🎉
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
                      <span className="font-semibold text-yellow-900 text-lg">{winner.name}</span>
                    </div>
                    <span className="text-sm text-yellow-700 bg-yellow-200/50 px-2 py-1 rounded">
                      {t.participant_number.replace("{number}", winner.originalIndex.toString())}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
