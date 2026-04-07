package domain

// --- 1. DATA STRUCTURES ---
type OperatingHours struct {
	IsOpen bool   `json:"isOpen"`
	Open   string `json:"open"`
	Close  string `json:"close"`
}

type StoreHours struct {
	Monday    OperatingHours `json:"monday"`
	Tuesday   OperatingHours `json:"tuesday"`
	Wednesday OperatingHours `json:"wednesday"`
	Thursday  OperatingHours `json:"thursday"`
	Friday    OperatingHours `json:"friday"`
	Saturday  OperatingHours `json:"saturday"`
	Sunday    OperatingHours `json:"sunday"`
}

// --- 2. EXPLICIT CONSTANTS ---
const (
	DefaultOpenTime  = "10:00"
	DefaultCloseTime = "22:00"

	DefaultMondayOpen    = true
	DefaultTuesdayOpen   = true
	DefaultWednesdayOpen = true
	DefaultThursdayOpen  = true
	DefaultFridayOpen    = true
	DefaultSaturdayOpen  = true
	DefaultSundayOpen    = false // Explicitly closed on Sundays by default
)

// --- 3. THE FACTORY FUNCTION ---
func NewDefaultStoreHours() *StoreHours {
	return &StoreHours{
		Monday:    OperatingHours{IsOpen: DefaultMondayOpen, Open: DefaultOpenTime, Close: DefaultCloseTime},
		Tuesday:   OperatingHours{IsOpen: DefaultTuesdayOpen, Open: DefaultOpenTime, Close: DefaultCloseTime},
		Wednesday: OperatingHours{IsOpen: DefaultWednesdayOpen, Open: DefaultOpenTime, Close: DefaultCloseTime},
		Thursday:  OperatingHours{IsOpen: DefaultThursdayOpen, Open: DefaultOpenTime, Close: DefaultCloseTime},
		Friday:    OperatingHours{IsOpen: DefaultFridayOpen, Open: DefaultOpenTime, Close: DefaultCloseTime},
		Saturday:  OperatingHours{IsOpen: DefaultSaturdayOpen, Open: DefaultOpenTime, Close: DefaultCloseTime},
		Sunday:    OperatingHours{IsOpen: DefaultSundayOpen, Open: DefaultOpenTime, Close: DefaultCloseTime},
	}
}
