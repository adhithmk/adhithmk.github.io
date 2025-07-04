import turtle

# Set up the screen
screen = turtle.Screen()
screen.bgcolor("white")
screen.title("Character Animation")

# Create turtle object
t = turtle.Turtle()
t.speed(0)  # Fastest animation speed

def draw_circle(x, y, radius, color):
    """Draw a filled circle at (x, y) with given radius and color"""
    t.penup()
    t.goto(x, y - radius)
    t.pendown()
    t.color(color)
    t.begin_fill()
    t.circle(radius)
    t.end_fill()

def draw_rectangle(x, y, width, height, color):
    """Draw a filled rectangle at (x, y) with given width and height"""
    t.penup()
    t.goto(x, y)
    t.setheading(0)
    t.color(color)
    t.begin_fill()
    for _ in range(2):
        t.forward(width)
        t.right(90)
        t.forward(height)
        t.right(90)
    t.end_fill()

def draw_head():
    """Draw the character's head"""
    draw_circle(-10, 50, 30, "#F5963F")  # Head

def draw_beanie():
    """Draw the character's beanie hat"""
    draw_rectangle(-40, 70, 60, 20, "#0A1D2C")  # Top of hat
    draw_circle(-10, 60, 30, "white")  # To hide overlap
    draw_rectangle(-40, 50, 60, 10, "#0A1D2C")  # Beanie band

def draw_body():
    """Draw the character's body"""
    draw_rectangle(-40, 0, 60, 60, "#1A2C3B")  # Torso
    draw_rectangle(-80, 0, 40, 15, "#1A2C3B")  # Left sleeve
    draw_rectangle(20, 0, 40, 15, "#1A2C3B")  # Right sleeve

def draw_legs():
    """Draw the character's legs"""
    draw_rectangle(-40, -60, 20, 50, "#163443")  # Left leg
    draw_rectangle(0, -60, 20, 50, "#163443")    # Right leg

def draw_arms():
    """Draw the character's arms and hands"""
    draw_rectangle(-80, -10, 20, 40, "#1A2C3B")  # Left arm
    draw_rectangle(60, -10, 20, 40, "#1A2C3B")   # Right arm
    draw_circle(-70, -30, 10, "#F5963F")         # Left hand
    draw_circle(70, -30, 10, "#F5963F")          # Right hand

def draw_mustache():
    """Draw the character's mustache"""
    t.penup()
    t.goto(-20, 30)
    t.setheading(0)
    t.color("black")
    t.pensize(4)
    t.pendown()
    t.forward(40)

def draw_mic():
    """Draw the microphone in character's hand"""
    draw_circle(-85, -40, 8, "black")  # Mic head
    t.penup()
    t.goto(-77, -40)
    t.pendown()
    t.pensize(2)
    t.goto(-40, -10)  # Cable to hand

def draw_face():
    """Draw the character's facial features"""
    draw_mustache()
    # Draw eyes (smiling eyes)
    t.penup()
    t.goto(-15, 45)
    t.setheading(-20)
    t.pendown()
    t.circle(10, 40)  # Left eye
    t.penup()
    t.goto(5, 45)
    t.setheading(-160)
    t.pendown()
    t.circle(10, 40)  # Right eye

def main():
    """Main function to draw the character"""
    # Draw the character
    draw_head()
    draw_beanie()
    draw_body()
    draw_arms()
    draw_legs()
    draw_face()
    draw_mic()
    
    # Hide the turtle and display the result
    t.hideturtle()
    
    # Keep the window open until clicked
    screen.exitonclick()

if __name__ == "__main__":
    main()
