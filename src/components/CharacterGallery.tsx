
import React, { useState } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CharacterVenture {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  details: string;
}

interface Character {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  ventures: CharacterVenture[];
}

const characters: Character[] = [
  {
    id: "mark-scout",
    name: "Mark Scout",
    role: "MDR Team Lead",
    image: "/placeholder.svg",
    bio: "Mark Scout leads the MDR team at Lumon Industries, where his work memories are surgically divided from his personal life.",
    ventures: [
      {
        id: "mdr-leadership",
        title: "MDR Leadership",
        description: "Mark's journey leading the Macrodata Refinement team.",
        image: "/placeholder.svg",
        location: "Lumon Industries - MDR Department",
        details: "Mark's leadership in the MDR department showcases his dedicated work ethic, despite the mysterious nature of the data they process. His team's respect for him is evident, though the true purpose of their work remains hidden."
      },
      {
        id: "grief-journey",
        title: "Grief and Memory",
        description: "Dealing with loss through separation of consciousness.",
        image: "/placeholder.svg",
        location: "Outside World",
        details: "After a personal tragedy, Mark turns to severance as a way to escape his grief for 8 hours each day. His journey navigating two separate lives reveals the complex relationship between memory and identity."
      }
    ]
  },
  {
    id: "helly-r",
    name: "Helly R.",
    role: "MDR Refiner",
    image: "/placeholder.svg",
    bio: "A new employee at Lumon who struggles to accept her severed fate from the very beginning.",
    ventures: [
      {
        id: "rebellion",
        title: "Rebellion",
        description: "Helly's fight against the severance procedure.",
        image: "/placeholder.svg",
        location: "Lumon Industries",
        details: "From her first moment as an Innie, Helly shows an unprecedented resistance to her circumstances, attempting increasingly desperate measures to communicate with her Outie and escape her corporate prison."
      },
      {
        id: "identity-crisis",
        title: "Identity Crisis",
        description: "Discovering the truth about her outer existence.",
        image: "/placeholder.svg",
        location: "Lumon Industries - Security Floor",
        details: "Helly's journey takes a dramatic turn as she uncovers shocking revelations about her outie's identity and true motivations, forcing her to question everything she thought she knew about herself."
      }
    ]
  },
  {
    id: "irving-b",
    name: "Irving Bailiff",
    role: "MDR Refiner",
    image: "/placeholder.svg",
    bio: "The longest-serving member of MDR, devoted to company policy and procedures.",
    ventures: [
      {
        id: "lumon-devotion",
        title: "Corporate Devotion",
        description: "Irving's deep commitment to Lumon's principles.",
        image: "/placeholder.svg",
        location: "Lumon Industries - MDR Department",
        details: "Initially the most devoted to Lumon's protocols and mythology, Irving recites company policy and shows reverence for Kier Eagan's teachings, finding comfort in the structure and routine."
      },
      {
        id: "forbidden-romance",
        title: "Forbidden Connection",
        description: "Developing a relationship with Burt from Optics & Design.",
        image: "/placeholder.svg",
        location: "Lumon Industries - O&D Department",
        details: "Despite department segregation policies, Irving forms a meaningful connection with Burt from O&D, challenging his rigid adherence to company rules and revealing a more complex, human side to his character."
      }
    ]
  },
  {
    id: "dylan-g",
    name: "Dylan George",
    role: "MDR Refiner",
    image: "/placeholder.svg",
    bio: "A competitive and reward-driven employee who gradually becomes a crucial ally.",
    ventures: [
      {
        id: "incentive-hunter",
        title: "Incentive Hunter",
        description: "Dylan's pursuit of Lumon's strange workplace rewards.",
        image: "/placeholder.svg",
        location: "Lumon Industries - Break Room",
        details: "Initially motivated by Lumon's bizarre incentive system, Dylan takes pride in his collection of finger traps, erasers, and other trivial rewards, competing fiercely to achieve the coveted Music Dance Experience and waffle party."
      },
      {
        id: "overtime-contingency",
        title: "Overtime Contingency",
        description: "Discovering and implementing the secret to awakening severed workers.",
        image: "/placeholder.svg",
        location: "Lumon Industries - Security Office",
        details: "After a shocking experience where his innie is awakened outside of work, Dylan becomes determined to master the Overtime Contingency protocol, putting himself at great risk to help his colleagues expose Lumon's secrets."
      }
    ]
  }
];

const CharacterGallery: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(characters[0]);
  const [selectedVenture, setSelectedVenture] = useState<CharacterVenture | null>(null);

  return (
    <section id="character-gallery" className="py-20 bg-lumon-dark text-white" data-scroll-section>
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-14" data-scroll data-scroll-speed="0.3">
          <h2 className="text-3xl md:text-4xl font-trap font-medium tracking-tight mb-4">
            Character <span className="text-lumon-accent">Ventures</span>
          </h2>
          
          <div className="w-20 h-1 bg-lumon-accent/60 mx-auto mb-6"></div>
          
          <p className="text-white/80 font-jakarta text-lg">
            Explore the unique journeys and ventures of Lumon's severed employees,
            both inside and outside the mysterious corporation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Character Selection */}
          <div className="lg:col-span-1" data-scroll data-scroll-speed="0.1">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm p-6">
              <h3 className="text-xl font-trap mb-4 text-lumon-accent">Characters</h3>
              
              <div className="space-y-3">
                {characters.map((character) => (
                  <div 
                    key={character.id}
                    className={cn(
                      "p-3 cursor-pointer transition-all duration-300",
                      "hover:bg-white/10 rounded-sm border border-transparent",
                      selectedCharacter.id === character.id ? "bg-white/10 border-lumon-accent/50" : ""
                    )}
                    onClick={() => setSelectedCharacter(character)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img 
                          src={character.image} 
                          alt={character.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-trap text-white">{character.name}</h4>
                        <p className="text-sm text-lumon-gray">{character.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Character Ventures */}
          <div className="lg:col-span-2" data-scroll data-scroll-speed="0.2">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-trap text-white">{selectedCharacter.name}</h3>
                  <p className="text-lumon-accent">{selectedCharacter.role}</p>
                </div>
                
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="outline" className="bg-transparent border-lumon-accent/30 text-lumon-accent hover:bg-lumon-accent/10">
                      Bio
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 bg-lumon-charcoal text-white border-lumon-accent/30">
                    <div className="flex justify-between space-x-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{selectedCharacter.name}</h4>
                        <p className="text-sm text-white/80">
                          {selectedCharacter.bio}
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
              
              <h4 className="text-lg font-trap mb-3 text-lumon-accent">Ventures</h4>
              
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {selectedCharacter.ventures.map((venture) => (
                    <CarouselItem key={venture.id} className="md:basis-1/2">
                      <Card className="bg-lumon-charcoal border-white/10 h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-white">{venture.title}</CardTitle>
                          <CardDescription className="text-lumon-gray">{venture.location}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="h-32 mb-3 rounded-sm overflow-hidden bg-black/20">
                            <img
                              src={venture.image}
                              alt={venture.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm text-white/70">{venture.description}</p>
                        </CardContent>
                        <CardFooter>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="w-full bg-transparent border-lumon-accent/30 text-lumon-accent hover:bg-lumon-accent/10"
                                onClick={() => setSelectedVenture(venture)}
                              >
                                Explore
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-lumon-charcoal text-white border-lumon-accent/30 max-w-xl">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-trap">{venture.title}</DialogTitle>
                                <DialogDescription className="text-lumon-gray">
                                  {venture.location}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="mb-4">
                                <div className="h-48 w-full rounded-sm overflow-hidden bg-black/20 mb-4">
                                  <img
                                    src={venture.image}
                                    alt={venture.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <ScrollArea className="h-[120px] rounded-sm">
                                  <div className="p-1">
                                    <p className="text-white/80 font-jakarta">
                                      {venture.details}
                                    </p>
                                  </div>
                                </ScrollArea>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </CardFooter>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CharacterGallery;
