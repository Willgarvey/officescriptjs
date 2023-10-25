// Equivalent of C# ProcessedLine class
class ProcessedLine {
  constructor() {
    this.LineID = 0;
    this.LineText = "";
  }
}

// Equivalent of C# ProcessedCollection class
class ProcessedCollection {
  constructor() {
    this.lines = [];
  }

  addLine(processedLine) {
    this.lines.push(processedLine);
  }

  // You can add other utility methods if needed
}

  
// Equivalent of C# ScriptLine class
class ScriptLine {
  constructor() {
    this.LineID = 0;
    this.Season = 0;
    this.Episode = 0;
    this.Scene = 0;
    this.LineText = "";
    this.Speaker = "";
    this.IsDeleted = "";
    this.Title = "";
    this.Dvd = 0;
  }
}

// Equivalent of C# ScriptCollection class
class ScriptCollection {
    constructor() {
      this.lines = [];
    }
  
    addLine(scriptLine) {
      this.lines.push(scriptLine);
    }
  
    // You can add other utility methods if needed
  }
  
  