erDiagram    
    PROJECT {
        string id
    }
    PROJECT ||--o{ SCHEDULE-EVENT : has
    SCHEDULE-EVENT {
        string id
        string projectId
        timestamp startsAt
        string description
    }
    PROJECT ||--o{ DISPLAY : has
    DISPLAY {
        string id
        string projectId
        string name
    }
    DISPLAY ||--o{ DISPLAY-SCENE : has
    DISPLAY-SCENE {
        string id
        string displayId
        string eventId
        string startsAt
        string templateId
        json templateConfig
    }
    DISPLAY-SCENE |o--o| SCHEDULE-EVENT : has
    DISPLAY-SCENE ||--|| TEMPLATE : has
    TEMPLATE {
        string id
        string name
        json config
    }
    TEMPLATE ||--o{ PRESET : has
    PRESET {
        string id
        string templateId  
        string name
        json templateConfig      
    }

    
    

