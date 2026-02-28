// Spieler-Datenstruktur
export const createPlayer = (name, color = "#3b82f6", image = null) => ({
  id: Date.now() + Math.random(),
  name,
  color, // Für visuelle Unterscheidung auf der Karte
  image, // Charakterbild URL/Path
  position: { q: 0, r: 0 }, // Aktuelle Hex-Position

  // Stats
  level: 1,
  exp: 0,
  expToNextLevel: 100,

  // SPECIAL Stats (Fallout-Style)
  special: {
    strength: 5, // Stärke - Nahkampf, Tragen
    perception: 5, // Wahrnehmung - Erkundung, Fallen erkennen
    endurance: 5, // Ausdauer - HP, Resistenzen
    charisma: 5, // Charisma - Handel, Diplomatie
    intelligence: 5, // Intelligenz - Crafting, Lernen
    agility: 5, // Beweglichkeit - Initiative, Ausweichen
    luck: 5, // Glück - Kritische Treffer, Loot
  },

  // Abgeleitete Stats
  hp: 100,
  maxHp: 100,
  stamina: 100,
  maxStamina: 100,

  // Ausrüstung
  equipment: {
    weapon: null,
    armor: null,
    helmet: null,
    gloves: null,
    boots: null,
    accessory1: null,
    accessory2: null,
  },

  // Inventar
  inventory: [],
  maxInventorySlots: 20,

  // Skills/Perks
  skills: [],
  availableSkillPoints: 0,

  // Status
  status: "idle", // idle, exploring, fighting, resting
  currentAction: null,
});

// Item-Struktur
export const createItem = (name, type, rarity = "common") => ({
  id: Date.now() + Math.random(),
  name,
  type, // weapon, armor, consumable, material, quest
  rarity, // common, uncommon, rare, epic, legendary
  description: "",
  stats: {},
  stackable: false,
  quantity: 1,
});

// Waffe erstellen
export const createWeapon = (name, damage, type = "melee") => ({
  ...createItem(name, "weapon"),
  damage,
  weaponType: type, // melee, ranged, magic
  critChance: 5,
  durability: 100,
  maxDurability: 100,
});

// Rüstung erstellen
export const createArmor = (name, defense, slot = "armor") => ({
  ...createItem(name, "armor"),
  defense,
  slot, // armor, helmet, gloves, boots
  durability: 100,
  maxDurability: 100,
});

// EXP berechnen
export const calculateExpForLevel = (level) => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Level-Up Logik
export const levelUpPlayer = (player) => {
  const newLevel = player.level + 1;
  return {
    ...player,
    level: newLevel,
    exp: player.exp - player.expToNextLevel,
    expToNextLevel: calculateExpForLevel(newLevel),
    availableSkillPoints: player.availableSkillPoints + 1,
    maxHp: player.maxHp + 10,
    hp: player.hp + 10,
    maxStamina: player.maxStamina + 5,
    stamina: player.stamina + 5,
  };
};

// SPECIAL Stat erhöhen
export const increaseSpecialStat = (player, stat) => {
  if (player.availableSkillPoints <= 0) return player;
  if (player.special[stat] >= 10) return player;

  return {
    ...player,
    special: {
      ...player.special,
      [stat]: player.special[stat] + 1,
    },
    availableSkillPoints: player.availableSkillPoints - 1,
  };
};

// Item zum Inventar hinzufügen
export const addItemToInventory = (player, item) => {
  if (player.inventory.length >= player.maxInventorySlots) {
    return { success: false, message: "Inventar voll!", player };
  }

  // Stackable Items zusammenführen
  if (item.stackable) {
    const existingItem = player.inventory.find(
      (i) => i.name === item.name && i.type === item.type
    );
    if (existingItem) {
      return {
        success: true,
        player: {
          ...player,
          inventory: player.inventory.map((i) =>
            i.id === existingItem.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        },
      };
    }
  }

  return {
    success: true,
    player: {
      ...player,
      inventory: [...player.inventory, item],
    },
  };
};

// Item ausrüsten
export const equipItem = (player, item) => {
  if (item.type === "weapon") {
    return {
      ...player,
      equipment: {
        ...player.equipment,
        weapon: item,
      },
      inventory: player.inventory.filter((i) => i.id !== item.id),
    };
  }

  if (item.type === "armor") {
    return {
      ...player,
      equipment: {
        ...player.equipment,
        [item.slot]: item,
      },
      inventory: player.inventory.filter((i) => i.id !== item.id),
    };
  }

  return player;
};

// Gesamte Defense berechnen
export const getTotalDefense = (player) => {
  let defense = 0;
  Object.values(player.equipment).forEach((item) => {
    if (item && item.defense) {
      defense += item.defense;
    }
  });
  return defense;
};

// Gesamten Schaden berechnen
export const getTotalDamage = (player) => {
  const weapon = player.equipment.weapon;
  const strengthBonus = Math.floor(player.special.strength / 2);
  return weapon ? weapon.damage + strengthBonus : strengthBonus;
};
