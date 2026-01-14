if _G.loading then return end
_G.loading = true

-- 基础服务
local Players = game:GetService("Players")
local HttpService = game:GetService("HttpService")
local TextChatService = game:GetService("TextChatService")
local LocalPlayer = Players.LocalPlayer
local PlayerGui = LocalPlayer:WaitForChild("PlayerGui")

-- 欢迎脚本配置
local WELCOME_DB_URL = "https://zmgyquxrwewbhwgidkjo.supabase.co/rest/v1/player_roles"
local WELCOME_DB_KEY = "sb_publishable_x0N_UMWmYTclQH-yxWdjNA_z3HqtdYl"

local welcomeMessages = {
    author = "✨ 欢迎违Hub脚本作者 {username} 加入游戏！",
    helper = "🔧 欢迎违Hub脚本助手 {username} 加入游戏！",
    donator = "💎 欢迎违Hub赞助者 {username} 加入游戏！"
}

local playerRoles = {}
local welcomeSent = {}
local welcomeEnabled = true -- 默认启用欢迎功能

-- 从数据库获取角色数据
local function fetchPlayerRoles()
    local success, response = pcall(function()
        local request = {
            Url = WELCOME_DB_URL,
            Method = "GET",
            Headers = {
                ["apikey"] = WELCOME_DB_KEY,
                ["Authorization"] = "Bearer " .. WELCOME_DB_KEY
            }
        }
        return HttpService:RequestAsync(request)
    end)
    
    if success and response and response.StatusCode == 200 then
        local data = HttpService:JSONDecode(response.Body)
        playerRoles = {} -- 清空旧数据
        for _, item in ipairs(data) do
            if item.username and item.role then
                playerRoles[item.username] = item.role
            end
        end
        return true
    end
    return false
end

-- 发送欢迎消息
local function sendWelcomeMessage(player)
    -- 不欢迎自己
    if player == LocalPlayer then return end
    
    if not player or welcomeSent[player.Name] then return end
    if not welcomeEnabled then return end
    
    local role = playerRoles[player.Name]
    if not role then return end
    
    local msgTemplate = welcomeMessages[role]
    if not msgTemplate then return end
    
    local message = msgTemplate:gsub("{username}", player.Name)
    
    local success = pcall(function()
        TextChatService.TextChannels.RBXGeneral:SendAsync(message)
    end)
    
    if success then
        welcomeSent[player.Name] = true
    end
    
    return success
end

-- 通用消息发送函数
local function sendSpecifiedMessage(message)
    local success, err = pcall(function()
        TextChatService.TextChannels.RBXGeneral:SendAsync(message)
        return true
    end)
    
    if not success then
        success = pcall(function()
            LocalPlayer.Chatted:Fire(message)
            return true
        end)
    end
    
    return success
end

-- 主界面
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "LoaderUI"
ScreenGui.Parent = PlayerGui

local MainFrame = Instance.new("Frame")
MainFrame.Size = UDim2.new(0, 300, 0, 300) -- 恢复原来的高度
MainFrame.Position = UDim2.new(0.5, -150, 0.5, -150)
MainFrame.BackgroundColor3 = Color3.fromRGB(30, 30, 30)
MainFrame.BackgroundTransparency = 0.3
MainFrame.BorderSizePixel = 0
MainFrame.Active = true
MainFrame.Draggable = true
MainFrame.Parent = ScreenGui

local UICorner = Instance.new("UICorner")
UICorner.CornerRadius = UDim.new(0, 12)
UICorner.Parent = MainFrame

local TitleLabel = Instance.new("TextLabel")
TitleLabel.Size = UDim2.new(1, 0, 0, 50)
TitleLabel.Position = UDim2.new(0, 0, 0, 0)
TitleLabel.BackgroundTransparency = 1
TitleLabel.Text = "违 Hub"
TitleLabel.Font = Enum.Font.SourceSansBold
TitleLabel.TextSize = 22
TitleLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
TitleLabel.TextXAlignment = Enum.TextXAlignment.Center
TitleLabel.TextYAlignment = Enum.TextYAlignment.Center
TitleLabel.Parent = MainFrame

local ScrollFrame = Instance.new("ScrollingFrame")
ScrollFrame.Size = UDim2.new(1, -20, 0, 150)
ScrollFrame.Position = UDim2.new(0, 10, 0, 60)
ScrollFrame.BackgroundTransparency = 1
ScrollFrame.ScrollBarThickness = 4
ScrollFrame.ScrollBarImageColor3 = Color3.fromRGB(200, 200, 200)
ScrollFrame.CanvasSize = UDim2.new(1, 0, 0, 150)
ScrollFrame.Parent = MainFrame

local NoticeLabel = Instance.new("TextLabel")
NoticeLabel.Size = UDim2.new(1, 0, 0, 150)
NoticeLabel.BackgroundTransparency = 1
NoticeLabel.Text = "欢迎使用违 Hub\n\n适配服务器: 自然灾害, 暴力区\n\n功能说明:\n• 自动欢迎特殊玩家\n• 游戏特定脚本\n\n我们会不断改进脚本,以便用户获得最佳体验"
NoticeLabel.Font = Enum.Font.SourceSans
NoticeLabel.TextSize = 16
NoticeLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
NoticeLabel.TextXAlignment = Enum.TextXAlignment.Center
NoticeLabel.TextYAlignment = Enum.TextYAlignment.Top
NoticeLabel.TextWrapped = true
NoticeLabel.Parent = ScrollFrame

-- 发送欢迎消息开关
local WelcomeToggle = Instance.new("TextButton")
WelcomeToggle.Size = UDim2.new(0, 20, 0, 20)
WelcomeToggle.Position = UDim2.new(0.5, -110, 1, -65)
WelcomeToggle.BackgroundColor3 = Color3.fromRGB(60, 60, 60)
WelcomeToggle.BackgroundTransparency = 0.3
WelcomeToggle.Text = "√"
WelcomeToggle.Font = Enum.Font.SourceSansBold
WelcomeToggle.TextSize = 14
WelcomeToggle.TextColor3 = Color3.fromRGB(255, 255, 255)
WelcomeToggle.TextXAlignment = Enum.TextXAlignment.Center
WelcomeToggle.TextYAlignment = Enum.TextYAlignment.Center
WelcomeToggle.Parent = MainFrame

local ToggleCorner1 = Instance.new("UICorner")
ToggleCorner1.CornerRadius = UDim.new(0, 4)
ToggleCorner1.Parent = WelcomeToggle

local WelcomeLabel = Instance.new("TextLabel")
WelcomeLabel.Size = UDim2.new(0, 180, 0, 20)
WelcomeLabel.Position = UDim2.new(0.5, -90, 1, -65)
WelcomeLabel.BackgroundTransparency = 1
WelcomeLabel.Text = "发送欢迎消息"
WelcomeLabel.Font = Enum.Font.SourceSans
WelcomeLabel.TextSize = 14
WelcomeLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
WelcomeLabel.TextXAlignment = Enum.TextXAlignment.Left
WelcomeLabel.Parent = MainFrame

WelcomeToggle.MouseButton1Click:Connect(function()
    welcomeEnabled = not welcomeEnabled
    WelcomeToggle.Text = welcomeEnabled and "√" or "×"
    WelcomeToggle.BackgroundColor3 = welcomeEnabled and Color3.fromRGB(60, 60, 60) or Color3.fromRGB(80, 20, 20)
end)

local StartButton = Instance.new("TextButton")
StartButton.Size = UDim2.new(0, 120, 0, 30)
StartButton.Position = UDim2.new(0.5, -60, 1, -35)
StartButton.BackgroundColor3 = Color3.fromRGB(30, 30, 30)
StartButton.BackgroundTransparency = 0.3
StartButton.Text = "开始使用"
StartButton.Font = Enum.Font.SourceSansBold
StartButton.TextSize = 18
StartButton.TextColor3 = Color3.fromRGB(255, 255, 255)
StartButton.TextXAlignment = Enum.TextXAlignment.Center
StartButton.TextYAlignment = Enum.TextYAlignment.Center
StartButton.Parent = MainFrame

local ButtonUICorner = Instance.new("UICorner")
ButtonUICorner.CornerRadius = UDim.new(0, 8)
ButtonUICorner.Parent = StartButton

-- 主启动函数
StartButton.MouseButton1Click:Connect(function()
    -- 初始化欢迎系统
    print("正在初始化欢迎系统...")
    local welcomeLoaded = fetchPlayerRoles()
    if welcomeLoaded then
        print("玩家角色数据加载成功")
        
        -- 为当前玩家发送欢迎消息（只针对数据库中有记录的用户）
        for _, player in ipairs(Players:GetPlayers()) do
            if welcomeEnabled then
                sendWelcomeMessage(player)
            end
        end
        
        -- 监听新玩家加入
        Players.PlayerAdded:Connect(function(player)
            if welcomeEnabled then
                sendWelcomeMessage(player)
            end
        end)
        
        -- 定期更新角色数据
        spawn(function()
            while true do
                wait(300)
                fetchPlayerRoles()
            end
        end)
    else
        print("警告: 无法加载玩家角色数据")
    end
    
    -- 加载游戏特定脚本
    local scripts = {
        [189707] = "https://raw.githubusercontent.com/opaajhone-afk/roblox-vd/main/自然灾害.lua",
        [93978595733734] = "https://raw.githubusercontent.com/opaajhone-afk/roblox-vd/main/暴力区.lua",
    }

    local gameId = game.PlaceId
    if scripts[gameId] then
        print("正在为游戏ID "..gameId.." 加载脚本...")
        local success, content = pcall(function()
            return game:HttpGet(scripts[gameId])
        end)
        if success and content then
            local func = loadstring(content)
            if func then
                -- 关闭主界面
                MainFrame:Destroy()
                ScreenGui:Destroy()
                
                -- 执行游戏脚本
                func()
                print("脚本加载成功")
            else
                print("脚本解析失败")
            end
        else
            print("脚本下载失败")
        end
    else
        warn("未适配此游戏")
        MainFrame:Destroy()
        ScreenGui:Destroy()
        LocalPlayer:Kick("未适配此游戏")
    end
    _G.loading = false
end)
